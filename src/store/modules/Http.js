const namespaced = {
  namespaced: true
}
const state = {
  host: 'https://www.qiangfen.com:9101',
  accessToken: 'nonenone',
  getTokenTimes: 0,
  indexData: '',
  detailData: '',
  isShowDetailAlert: false
}

const mutations = {
  CHANGETOKEN (state, params) {
    state.accessToken = params.token
  },
  CHANGE_INDEX_DATA (state, params) {
    state.indexData = params.indexData
  },
  CHANGE_DETAIL_DATA (state, params) {
    state.detailData = params.detailData
  },
  CHANGE_DETAIL_ALERT (state, params) {
    state.isShowDetailAlert = !state.isShowDetailAlert
  }
}

const actions = {
  changeToken ({ commit }, params) {
    // do something async
    commit('CHANGETOKEN', params)
  },
  changeIndexData ({ commit }, params) {
    // do something async
    commit('CHANGE_INDEX_DATA', params)
  },
  changeDetailData ({ commit }, params) {
    // do something async
    commit('CHANGE_DETAIL_DATA', params)
  },
  changeDetailAlert ({ commit }, params) {
    // do something async
    commit('CHANGE_DETAIL_ALERT', params)
  }
}

export default {
  namespaced,
  state,
  mutations,
  actions
}
