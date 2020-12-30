<template>
  <div id="nav">
    <b-navbar sticky toggleable="md" type="dark" variant="dark">
        <b-navbar-brand href="#">文本标注系统</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav class="ml-2">
          <b-navbar-nav>
            <b-nav-item>
              <router-link :to="{name: ''}">我的项目</router-link>
            </b-nav-item>
            <b-nav-item href="#">其他</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <template #button-content>
                {{ username }}
              </template>
              <b-dropdown-item href="#">个人信息</b-dropdown-item>
              <b-dropdown-item @click="logout">退出</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
// @ is an alias to /src

import {request} from "../network/request";

export default {
  name: 'Home',
  data() {
    return {
      username: localStorage.getItem('user')
    }
  },
  beforeRouteEnter: (to, from, next) => {
    request({
      config: {
        method: 'get',
        url: '/api/user/is_authenticated/',
      }
    }).then(res => {
      if (!res.data['is_superuser'])
        next()
      else {
        alert('权限不足')
        next({name: 'Login', replace: true})
      }
    })
  },
  methods: {
    logout(){
      request({
        config:{
          url:'/api/user/logout/',
          method:'post',
          headers:{
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          }
        }
      }).then(res => {
        let result = res.data
        if(result.status === 'success'){
          window.location.reload()
        }
      })
    }
  },
}
</script>

<style scoped>
#nav a{
  text-decoration: none;
  transition: color 300ms ease-in-out;
}
#nav a.router-link-exact-active {
  color: white;
}
</style>