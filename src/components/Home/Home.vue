<template>
  <div>
    <b-navbar id="nav" sticky toggleable="md" type="dark" variant="dark">
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
              {{ $store.state.username }}
            </template>
            <b-dropdown-item href="#">个人信息</b-dropdown-item>
            <b-dropdown-item @click="logout">退出</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="container mt-5">
      <b-table :fields="fields" small hover :items="items">
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template #cell(state)="data">
          <div v-if="data.item.state">
            <b-badge variant="success">Finished</b-badge>
          </div>
          <div v-else>
            <b-badge variant="danger">ongoing</b-badge>
          </div>
        </template>
        <template #cell(option)="data">
          <b-button size="sm" variant="primary" @click="edit($event,data.item.project_name)">编辑</b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import {request} from "../../network/request";

export default {
  name: "Home",
  mounted() {
    request({
      config: {
        url: 'api/user/get_userinfo/',
        method: 'get'
      }
    }).then(res => {
      this.items = res.data
    })
  },
  data() {
    return {
      fields: [
        {key: 'index', label: 'id',},
        {key: 'project_name', label: '项目名称'},
        {key: 'date_joined', label: '参与时间'},
        {key: 'state', label: '状态'},
        {key: 'option', label: '操作'},
      ],
      items: []
    }
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
    edit(e, name) {
      this.$router.push({
        name: 'project_edit', query: {id:name}
      })
    }
  }
}
</script>

<style scoped>
#nav a {
  text-decoration: none;
  transition: color 300ms ease-in-out;
}

#nav a.router-link-exact-active {
  color: white;
}
</style>