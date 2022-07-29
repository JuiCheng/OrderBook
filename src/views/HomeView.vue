<template>
  <v-card color='#131B29' class="card" flat>
    <v-card-title  >
      <span class="text-h5 white--text title">Order Book</span>
      <v-divider color='Quote_table_head_text_color'></v-divider>
    </v-card-title>
    <v-caed-text>
      <OrderTable model='Sell' :data='orderData.asks'></OrderTable>
    </v-caed-text>
    <v-caed-text class="text-h6 " v-if='CurrentPriceIcon'>
      <v-alert class='current_price' :style="CurrentPriceStyle">{{ThousandsSeparators(CurrentPrice)}}
        <v-icon  style="width:15px;">fas fa-arrow-up</v-icon>
      </v-alert>
    </v-caed-text>
    <v-caed-text class="text-h6 " v-else>
      <v-alert class='current_price' :style="CurrentPriceStyle">{{ThousandsSeparators(CurrentPrice)}}
        <v-icon  style="width:15px;">fas fa-arrow-down</v-icon>
      </v-alert>
    </v-caed-text>
    <v-caed-text>
      <OrderTable model='Buy' :data='orderData.bids'></OrderTable>
    </v-caed-text>
  </v-card>
</template>

<script lang="ts">
import Socket from '@/utils/socket'
import OrderTable from '@/components/OrderTable.vue'
import { defineComponent, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'

interface OrderDataPrice {
  bids: any,
  asks: any,
  seqNum: number,
  prevSeqNum: number,
  type: string,
  symbol: string,
  timestamp: number
}
interface OrderData {
  topic: string,
  data: OrderDataPrice,
}

export default defineComponent({
  name: 'HomeView',
  components: {
    OrderTable
  },
  setup () {
    const socket = Socket()
    const socket1 = Socket()
    const CurrentPrice = ref<number>(0)
    const CurrentPriceStyle = ref<string>('background-color: rgba(255, 90, 90, 0.12); color: #FF5B5A')
    const CurrentPriceIcon = ref<boolean>(false)
    const orderData = ref<OrderData>({
      topic: 'update:BTCPFC',
      data: {
        bids: [
          []
        ],
        asks: [
          []
        ],
        seqNum: 0,
        prevSeqNum: 0,
        type: 'delta',
        symbol: 'BTCPFC',
        timestamp: 1658822431343
      }
    })
    const store = useStore()

    watchEffect(() => {
      // console.log(store.state.ws.wsRes)
      const { topic, data } = store.state.ws.wsRes
      switch (topic) {
        case 'update:BTCPFC':
          console.log('update:BTCPFC')
          console.log(data)
          orderData.value = data
          if (data.seqNum - data.prevSeqNum !== 1) {
            subscribe(false)
            window.setTimeout(() => subscribe(true), 1000)
          }

          break
        case 'tradeHistoryApi':
          console.log('tradeHistoryApi')
          // console.log(data)
          if (data[0].price > CurrentPrice.value) {
            CurrentPriceStyle.value = 'background-color: rgba(16, 186, 104, 0.12); color: #00b15d'
            CurrentPriceIcon.value = true
          } else {
            CurrentPriceStyle.value = 'background-color: rgba(255, 90, 90, 0.12); color: #FF5B5A'
            CurrentPriceIcon.value = false
          }
          CurrentPrice.value = data[0].price
          // OrderData = data
          break
      }
    })

    socket.connect()
    socket1.connect('wss://ws.btse.com/ws/futures')
    const subscribe = (flag:boolean) => {
      if (flag) {
        socket.send(
          {
            op: 'subscribe',
            args: [
              'update:BTCPFC'
            ]
          }
        )
      } else {
        socket.send(
          {
            op: 'unsubscribe',
            args: [
              'update:BTCPFC'
            ]
          }
        )
      }
    }
    const tradeHistoryApi = () => {
      socket1.send(
        {
          op: 'subscribe',
          args: [
            'tradeHistoryApi:BTCPFC'
          ]
        }
      )
    }
    const ThousandsSeparators = (money:number) => {
      return money.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    }
    window.setTimeout(() => subscribe(true), 3000)
    window.setTimeout(tradeHistoryApi, 3000)
    return {
      orderData,
      CurrentPrice,
      CurrentPriceStyle,
      CurrentPriceIcon,
      ThousandsSeparators
    }
  }
})
</script>
