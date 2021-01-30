<template>
  <b-navbar id="nav" toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand :to="{name: 'Home'}">文本标注系统</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item>
          <router-link tag="li" :to="{name: 'project_edit',query: {id:project_info.project_name}}">
            {{ project_info.project_name }}
          </router-link>
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-navbar-nav>
          <b-nav-text>{{ project_info.project_type }}</b-nav-text>
        </b-navbar-nav>
        <b-nav-item-dropdown right class="ml-3">
          <template #button-content>
            {{ $store.state.username }}
          </template>
          <b-dropdown-item href="#">个人信息</b-dropdown-item>
          <b-dropdown-item @click="logout">退出登录</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import {request} from "../../network/request";

export default {
  name: "NavBar",
  data() {
    return {
      project_info: {},
    }
  },
  activated() {
    request({
      config: {
        url: 'api/annotation_task/get_project_overview/',
        method: 'get',
        params: {
          id: this.$route.query.id
        }
      }
    }).then(res => {
      this.project_info = res.data
      this.$store.commit('setTagInfo',{type:this.project_info.project_type})
    })
  },
  methods: {
    logout() {
      request({
        config: {
          url: '/api/user/logout/',
          method: 'post',
          headers: {
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          }
        }
      }).then(res => {
        let result = res.data
        if (result.status === 'success') {
          window.location.reload()
        }
      })
    },
  }
}
</script>

<style scoped>
#nav li.router-link-active {
  color: white;
}
</style>