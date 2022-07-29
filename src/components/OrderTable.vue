<template>
  <v-container fluid>
    <table class="table">
      <thead class="head">
        <th align="left">Price (USD)</th>
        <th >Size</th>
        <th align="right">Total</th>
      </thead>
      <tbody class="body">
          <tr class="tr" :style="PriceAnimation[index]" v-for='(item, index) in Orders' :key='index'>
              <td align="left" :class="PriceColoe">{{ThousandsSeparators(item.Price)}}</td>
              <td align="center" class="size" :style="SizeAnimation[index]">{{ThousandsSeparators(item.Size)}}</td>
              <td align="right" class="total" :style="{'--width': `${TotalSizeBar(TotleStats(index))}%`,'--color':model=='Buy'?'rgba(16, 186, 104, 0.12)':'rgba(255, 90, 90, 0.12)'}">{{ThousandsSeparators(TotleStats(index))}}</td>
          </tr>
      </tbody>
    </table>
  </v-container>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue'
interface OrderFormat {
  Price: number
  Size: number
  Total?: number
}
export default defineComponent({
  name: 'OrderTable',
  props: ['model', 'data'],
  setup (props) {
    const PriceColoe = ref<string>('')
    const PriceAnimation = ref<string[]>(Array(8))
    const SizeAnimation = ref<string[]>(Array(8))
    const Orders = ref<OrderFormat[]>(Array(8))
    for (let i = 0; i < 8; i++) {
      Orders.value[i] = {
        Price: 0,
        Size: 0
      }
    }
    const ThousandsSeparators = (money:number) => {
      return money.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    }
    const TotalSizeBar = (Total:number) => {
      switch (props.model) {
        case 'Buy':
          console.log(Total / TotleStats(7) * 100)
          return Total / TotleStats(7) * 100
        case 'Sell':
          return Total / TotleStats(0) * 100
      }
    }
    const TotleStats = (index:number) => {
      let sum = 0
      switch (props.model) {
        case 'Buy':
          for (let i = 0; i <= index; i++) {
            sum += Orders.value[i].Size
          }
          break
        case 'Sell':
          for (let i = 7; i >= index; i--) {
            sum += Orders.value[i].Size
          }
          break
      }
      return sum
    }
    watch(props, (newVal, oldVal) => {
      newVal.data.forEach((element:any, index:number) => {
        if (parseFloat(element[1]) > 0) {
          if (parseFloat(element[0]) < Orders.value[7].Price) {
            Orders.value.push({
              Price: parseFloat(element[0]),
              Size: parseInt(element[1]),
              Total: index > 0 ? newVal.data[index - 1][1] + parseInt(element[1]) : parseInt(element[1])
            })
            Orders.value = Orders.value.slice(1, 9)
          } else {
            const equal = Orders.value.findIndex(item => {
              return item.Price === parseFloat(element[0])
            })
            if (equal > -1) {
              if (parseInt(element[1]) > Orders.value[equal].Size) {
                SizeAnimation.value[equal] = '#00b15d'
              } else if (parseInt(element[1]) < Orders.value[equal].Size) {
                SizeAnimation.value[equal] = '#FF5B5A'
              }
              window.setTimeout(() => {
                SizeAnimation.value[equal] = 'background-color: transparent;'
              }
              , 100)
              Orders.value[equal] = {
                Price: parseFloat(element[0]),
                Size: parseInt(element[1]),
                Total: index > 0 ? newVal.data[index - 1][1] + parseInt(element[1]) : parseInt(element[1])
              }
            } else {
              const num = Orders.value.findIndex(item => {
                return item.Price < parseFloat(element[0])
              })
              Orders.value[num] = {
                Price: parseFloat(element[0]),
                Size: parseInt(element[1]),
                Total: index > 0 ? newVal.data[index - 1][1] + parseInt(element[1]) : parseInt(element[1])
              }
              Orders.value = Orders.value.slice(0, 8)
              switch (props.model) {
                case 'Buy':
                  PriceAnimation.value[num] = 'background-color: rgba(0, 177, 93, 0.5)'
                  break
                case 'Sell':
                  PriceAnimation.value[num] = 'background-color: rgba(255, 91, 90, 0.5)'
                  break
              }
              window.setTimeout(() => {
                PriceAnimation.value[num] = 'background-color: transparent;'
              }
              , 100)
            }
          }
        }
      })
      // console.log(Orders.value)
    })

    // console.log(props.model)
    switch (props.model) {
      case 'Buy':
        PriceColoe.value = 'buy_price_coloe'
        break
      case 'Sell':
        PriceColoe.value = 'sell_price_coloe'
        break
    }
    return {
      PriceColoe,
      PriceAnimation,
      SizeAnimation,
      Orders,
      TotleStats,
      TotalSizeBar,
      ThousandsSeparators
    }
  }
})
</script>
