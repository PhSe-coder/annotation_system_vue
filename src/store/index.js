import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    selectedIsValid:false,
    selected:{
      start: 0,
      end: 0,
      text:''
    },
    tagInfo:{

    }
  },
  mutations: {
    setName(state, name) {
      state.username = name
    },
    setSelectedIsValid(state, isValid) {
      state.selectedIsValid = isValid
    },
    setSelected(state, selected) {
      state.selected = selected
    },
    setTagInfo(state, tagInfo){
      state.tagInfo = tagInfo
    }
  },
  actions: {},
  modules: {}
})