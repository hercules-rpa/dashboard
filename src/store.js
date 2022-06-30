import Vue from 'vue'
import Vuex from 'vuex'
import { saveToken, destroyToken } from '@/common/jwt.service'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(189, 42, 51, .8), rgba(189, 42, 40, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    logged: false,
    test: false,
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    login (state, parameters) {
      saveToken(parameters.token)
      state.logged = true
    },
    logout (state) {
      destroyToken()
      state.logged = false
    },
  },
  actions: {
    loginAction (context, parameters) {
      context.commit('login', parameters)
    },
    logoutAction (context) {
      context.commit('logout')
    },
  },
  getters: {
    isLogged (state) {
      return state.logged
    },
  },
})
