<template>
  <div class="home">
    <h1>user</h1>
  </div>
</template>

<script>
// @ is an alias to /src

import {request} from "../network/request";

export default {
  name: 'Home',
  data() {
    return {}
  },
  methods: {},
  components: {},
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
  }
}
</script>
