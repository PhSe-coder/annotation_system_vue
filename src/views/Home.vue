<template>
  <div>
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
  beforeRouteEnter: (to, from, next) => {
    request({
      config: {
        method: 'get',
        url: '/api/user/is_authenticated/',
      }
    }).then(res => {
      if (!res.data['is_superuser'])
        next(vm => {
          vm.$store.commit('setName', res.data['username'])
        })
      else {
        alert('权限不足')
        next({name: 'Login', replace: true})
      }
    })
  },
}
</script>

<style scoped>

</style>