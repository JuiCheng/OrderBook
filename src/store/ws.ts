const WsState = {
  wsRes: {}
}
export const state = WsState
export const actions = {}

export const mutations = {
  setWsRes (state: typeof WsState, payload: typeof Object) {
    // console.log(payload)
    state.wsRes = payload
    // console.log(state.wsRes)
  }
}
export const getters = {}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
}
