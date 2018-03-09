const namespaced = {
  namespaced: true
}
const state = {
  currentCategory: '',
  currentCourse: '',
  navIsCol: false
}

const mutations = {
  CHANGE_CURRENT_CATEGORY (state, params) {
    state.currentCategory = params.category
  },
  CHANGE_CURRENT_COURSE (state, params) {
    state.currentCourse = params.course
  },
  CHANGE_NAV (state, params) {
    state.navIsCol = params.navState
  }
}

const actions = {
  changeCurrentCategory ({ commit }, params) {
    // do something async
    commit('CHANGE_CURRENT_CATEGORY', params)
  },
  changeCurrentCourse ({ commit }, params) {
    // do something async
    commit('CHANGE_CURRENT_COURSE', params)
  },
  changeNav ({ commit }, params) {
    // do something async
    commit('CHANGE_NAV', params)
  }
}

export default {
  namespaced,
  state,
  mutations,
  actions
}
