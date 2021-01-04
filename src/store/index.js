import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    selected:{
      start: 0,
      end: 0,
      text:''
    }
  },
  mutations: {
    setName(state, name) {
      state.username = name
    },
    setSelected(state, selected) {
      state.selected = selected
    }
  },
  actions: {},
  modules: {}
})