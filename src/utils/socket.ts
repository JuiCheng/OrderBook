import { useStore } from 'vuex'
export default function emitter () {
  const store = useStore()
  const wsUrl = 'wss://ws.btse.com/ws/oss/futures'
  let socket = new WebSocket('wss://ws.btse.com/ws/oss/futures')
  const send = (message: any) => {
    if (socket.readyState === 1) socket.send(JSON.stringify(message))
  }
  const connect = (wsUrl?:string) => {
    socket = wsUrl ? new WebSocket(wsUrl) : socket
    socket.onmessage = function (msg) {
      // console.log(msg)
      store.commit('ws/setWsRes', JSON.parse(msg.data)) // vuex mutations 呼叫
      // emitter.$emit('message', msg.data)
    }
    socket.onerror = function (err) {
      console.log(err)
      // emitter.$emit('error', err)
    }
    // socket.onclose = function () {
    //   // emitter.connect()
    // }
  }
  return {
    connect,
    send
  }
}
