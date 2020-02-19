import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    auth : JSON.parse(localStorage.getItem('auth')) || {},
    endpoint: process.env.ENDPOINT
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, auth) {
      state.status = 'success'
      state.auth = auth
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.auth = {}
    }
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post( this.state.endpoint + '/account/login', user ).then((res) => {
          const auth = res.data
          localStorage.setItem('auth', JSON.stringify(auth))
          axios.defaults.headers.common['Authorization'] = auth.token
          commit('auth_success', auth)
          resolve(res)
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post( this.state.endpoint + '/account/create', user ).then((res) => {
          resolve(res)
        })
        .catch(err => {
          commit('auth_error', err)
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    validate({ commit }, code) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post( this.state.endpoint + '/account/validate/' + code, {}).then((res) => {
          const auth = res.data
          localStorage.setItem('auth', JSON.stringify(auth))
          axios.defaults.headers.common['Authorization'] = auth.token
          commit('auth_success', auth)
          resolve(res)
        })
        .catch(err => {
          commit('auth_error', err)
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        const user = this.state.auth.user
        commit('logout')
        delete axios.defaults.headers.common['Authorization']
        resolve(user)
      })
    }
  },
  getters : {
    getAuth: state => state.auth,
    isLoggedIn: state => !!state.auth.token,
    authStatus: state => state.status,
  }
})