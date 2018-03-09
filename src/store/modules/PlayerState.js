const namespaced = {
  namespaced: true
}
const state = {
  currentPlayCourse: '',
  activeVideoIndex: {
    one: 0,
    two: 0
  }
}

const mutations = {
  CHANGE_CURRENT_PLAY_COURSE (state, params) {
    state.currentPlayCourse = params.course
    saveLocal(state)
  },
  CHANGE_VIDEO_INDEX (state, params) {
    state.activeVideoIndex.one = params.one
    state.activeVideoIndex.two = params.two
    saveLocal(state)
  },
  CHANGE_STATE (state, params) {
    for (let key in state) {
      state[key] = params.state[key]
    }
    saveLocal(state)
  }
}

const actions = {
  changeCurrentPlayCourse ({ commit }, params) {
    // do something async
    commit('CHANGE_CURRENT_PLAY_COURSE', params)
  },
  changeVideoIndex ({ commit }, params) {
    // do something async
    commit('CHANGE_VIDEO_INDEX', params)
  },
  changeState  ({ commit }, params) {
    // do something async
    commit('CHANGE_STATE', params)
  }
}

const saveLocal = function (state) {
  sessionStorage.setItem('playState', JSON.stringify(state))
}

export default {
  namespaced,
  state,
  mutations,
  actions
}
