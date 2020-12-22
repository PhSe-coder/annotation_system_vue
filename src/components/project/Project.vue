<template>
  <div class="container">
    <div class="row mt-4 mb-4">
      <div class="col-4">
        <router-link :to="{name: 'admin_create_project'}" class="px-4 btn btn-danger rounded-pill">
          <i class="fa fa-plus" aria-hidden="true"></i>
          <span class="ml-1">创建项目</span>
        </router-link>
      </div>
      <div class="col-6">
        <div class="text-center">
          <button class="btn btn-primary">All</button>
          <div class="btn-group ml-2" role="group" aria-label="button group">
            <button type="button" class="btn btn-light">Ongoing</button>
            <button type="button" class="btn btn-light">Finish</button>
          </div>
        </div>
      </div>
      <div class="col-2">
        <button class="btn btn-dark" @click="logout">Logout</button>
      </div>
    </div>
    <project-list></project-list>
  </div>
</template>

<script>
import ProjectList from "./ProjectList";
import {request} from "../../network/request";


export default {
  name: "Home",
  components: {
    ProjectList
  },
  methods:{
    logout(){
      request({
        config:{
          method:'post',
          url:'/api/user/logout/',
          headers: {
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          }
        }
      }).then(res => {
        let result = res.data
        if(result.status === 'success'){
          this.$router.replace({name: 'login'})
        }
      })
    }
  }
}
</script>

<style scoped>
.btn-danger {
  box-shadow: 0 2px 6px 0 rgba(220, 35, 49, 0.5);
}

</style>