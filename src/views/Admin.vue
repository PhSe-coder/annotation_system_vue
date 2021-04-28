<template>
  <div class="d-flex">
    <side-bar></side-bar>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import {request} from '@/network/request'
import SideBar from "../components/admin/SideBar";

export default {
  name: "Admin",
  components: {
    SideBar,
  },
  beforeRouteEnter: (to, from, next) => {
    request({
      config: {
        method: 'get',
        url: '/api/user/is_authenticated/',
      }
    }).then(res => {
      if (res.data['is_superuser'])
        next()
      else {
        alert('权限不足')
        next({name: 'Home', replace: true})
      }
    })
  }
}
</script>