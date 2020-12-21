import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import jQuery from 'jquery/dist/jquery.js'
import 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

Vue.use(BootstrapVue, {
  BDropdown:{
    tag: 'a'
  }
})
Vue.use(IconsPlugin)
window.$  = jQuery


Vue.config.productionTip = true
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
