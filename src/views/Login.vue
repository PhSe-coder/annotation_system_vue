<template>
  <div class="container mt-5 col-4">
    <form @submit="prevent_submit" class="needs-validation" novalidate>
      <div class="form-group">
        <label for="username">用户名</label>
        <input placeholder="用户名" type="text" class="form-control" id="username" v-model.lazy="username" required
               aria-describedby="usernameHelp">
        <div class="invalid-feedback">
          Please provide a valid username.
        </div>
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input placeholder="密码" type="password" class="form-control" id="password" v-model.lazy="password" required>
        <div class="invalid-feedback">
          Please provide a valid password.
        </div>
      </div>
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1">
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-success btn-block" :disabled="waiting">
        <span v-if="!waiting">登录</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span class="sr-only">Loading...</span>
          Loading...
        </span>
      </button>
    </form>
  </div>
</template>

<script>

import {request} from '@/network/request'
import Vue from "vue";

export default {
  name: "Login",
  data() {
    return {
      waiting: false,
      username: '',
      password: '',
    }
  },
  methods: {
    login() {
      this.waiting = true
      request({
        config: {
          method: 'post',
          url: '/api/user/login/',
          data: {
            username: this.username,
            password: this.password,
          },
          headers: {
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          }
        }
      }).then(res => {
        let result = res.data
        this.waiting = false
        if (result.status === 'success') {
          if(!result['is_superuser'])
            this.$router.replace({name: 'Home',})
          else
            this.$router.replace({name: 'admin_project',})
        } else {
          alert('用户名或密码不正确')
        }
      }).catch(err => {
        this.waiting = false
        console.log(err)
      })
    },
    prevent_submit(e) {
      let target = e.target
      e.preventDefault();
      if (target.checkValidity() === false) {
        target.classList.add('was-validated');
      } else {
        this.login()
      }
    }
  },
  beforeRouteEnter: (to, from, next) => {
    if (!Vue.$cookies.get('sessionid')) {
      next()
      return
    }
    request({
      config: {
        method: 'get',
        url: '/api/user/is_authenticated/',
      }
    }).then(res => {
      if (res.data['is_authenticated'] !== undefined && !res.data['is_authenticated']) {
        next()
      } else {
        if(res.data['is_superuser'])
          next({name: 'admin_project', replace: true})
        else
          next({name: 'Home', replace: true})
      }
    })
  }
}
</script>

<style scoped>

</style>