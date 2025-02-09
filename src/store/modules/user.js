import * as userApi from '@/apis/user'
const state = {
  user: null,
  token: null,
}
const mutations = {
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
}
const actions = {
  async loginAsync({ commit }, data) {
    const response = await userApi.loginAsync(data)
    if (response.return_code == '0') {
      commit('SET_TOKEN', response.data.token)
    }
    return response
  },
  setUser({ commit }, user) {
    commit('SET_USER', user)
  },
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  logout({ commit }) {
    sessionStorage.clear()
    localStorage.clear()
  },
}
const getters = {
  user: (state) => state.user,
  token: (state) => state.token,
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
