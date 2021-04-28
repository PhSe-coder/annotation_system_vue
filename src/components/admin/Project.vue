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
          <button class="btn" :class="[index===0 ? 'btn-primary' : 'btn-light']" @click="selectAll">All</button>
          <div class="btn-group ml-2" role="group" aria-label="button group">
            <button type="button" class="btn" :class="[index===1 ? 'btn-primary' : 'btn-light']" @click="selectOngoing">Ongoing</button>
            <button type="button" class="btn" :class="[index===2 ? 'btn-primary' : 'btn-light']" @click="selectFinish">Finish</button>
          </div>
        </div>
      </div>
      <div class="col-2">
        <button class="btn btn-dark" @click="logout">Logout</button>
      </div>
    </div>
    <div class="row row-cols-2">
      <project-item v-show="item['project_progress'].toFixed(2) * 100 <= max_progress && min_progress <=item['project_progress'].toFixed(2) * 100"
                    class="col mb-3" v-for="item in projectInfo" :key="item['project_name']"
                    :description="item['project_description']" :name="item['project_name']"
                    :type="item['project_type']" :tasks="item['count']"
                    :members="item['project_members']" :progress="item['project_progress'].toFixed(2) * 100" :users="usernames">
      </project-item>
    </div>
  </div>
</template>

<script>
import {request} from "../../network/request";
import ProjectItem from "./ProjectItem";
import bus from "../bus";


export default {
  name: "Home",
  components: {
    ProjectItem
  },
  data(){
    return {
      index:0,
      projectInfo: [],
      usernames:[],
      min_progress:0,
      max_progress:100
    }
  },
  methods:{
    get_project_list() {
      request({
        config: {
          url: '/api/annotation_task/get_project_info',
          method: 'get'
        }
      }).then(res => {
        if (res.status === 200) {
          this.projectInfo = res.data
        }
      })
    },
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
          window.location.reload()
        }
      })
    },
    selectAll(){
      this.index = 0
      this.min_progress = 0
      this.max_progress = 100
    },
    selectOngoing(){
      this.index = 1
      this.min_progress = 0
      this.max_progress = 99
    },
    selectFinish(){
      this.index = 2
      this.min_progress = 100
      this.max_progress = 100
    }
  },
  created() {
    this.get_project_list()
    bus.$on("update_project", () => {
      this.get_project_list()
    })
    request({
      config:{
        url:'api/user/get_username/',
        method:'get',
      }
    }).then(res => {
      console.log(res.data)
      this.usernames = res.data
    })
  },
}
</script>

<style scoped>
.btn-danger {
  box-shadow: 0 2px 6px 0 rgba(220, 35, 49, 0.5);
}

</style>