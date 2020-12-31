<template>
  <div class="container">
    <div class="row my-4">
      <h5 class="text-muted font-weight-bold col-4">创建项目</h5>
    </div>
    <form @submit="create_project"  novalidate>
      <div class="row">
        <div class="form-group col-md-6">
          <label for="project_name">名称</label>
          <input v-model="project_name" type="text" class="form-control" id="project_name" placeholder="输入标注项目的名称" required>
        </div>
        <div class="form-group col-md-6">
          <label for="project_file">标注文件</label>
          <div class="custom-file">
            <input @change="get_file" type="file" accept=".txt" class="custom-file-input" id="project_file" lang="zh" required>
            <label class="custom-file-label" for="project_file" data-browse='上传'>Choose file</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-form-label mb-1">标注类型</div>
        <div class="custom-control custom-radio custom-control-inline" v-for="type in project_types">
          <input class="custom-control-input" v-model="project_type" type="radio" name="project_type" :id="type" :value="type" >
          <label class="custom-control-label" :for="type">{{ type }}</label>
        </div>
      </div>
      <div class="form-group">
        <label for="project_members">标注成员</label>
        <select v-model="project_members" id="project_members" class="custom-select" size="4" multiple required>
          <option v-for="user in users" :value="user['username']" >{{user['username']}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="project_description">项目描述</label>
        <textarea type="text" class="form-control" rows="3" style="resize: none" id="project_description" placeholder="输入标注项目的描述内容" v-model="project_description"></textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-block" :disabled="waiting">
        <span v-if="!waiting">创建</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...
        </span>
      </button>
    </form>
  </div>
</template>

<script>
import bsCustomFileInput from 'bs-custom-file-input'
import {request} from '@/network/request'
import bus from "../bus";


export default {
  name: "CreateProject",
  mounted() {
    bsCustomFileInput.init()
  },
  created() {
    request({
      config: {
        method: 'post',
        url: '/api/user/get_username/',
        headers: {
          'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
        }
      }
    }).then(res =>{
      this.users = res.data
    })
  },
  data(){
    return {
      waiting: false,
      project_types: ["命名实体标注", "词性标注"],
      users:[],
      project_name:'',
      project_file:'',
      project_type:'',
      project_members:[],
      project_description:''
    }
  },
  methods: {
    get_file(e){
      this.project_file = e.target.files[0]
      console.log(this.project_file);
    },
    create_project(e){
      console.log(e)
      let target = e.target
      e.preventDefault();
      if (target.checkValidity() === false) {
        target.classList.add('was-validated');
      }else{
        let data = new FormData()
        data.append('project_name',this.project_name)
        data.append('project_file',this.project_file)
        data.append('project_type',this.project_type)
        data.append('project_members',this.project_members)
        data.append('project_description',this.project_description)
        this.waiting = true
        request({
          config: {
            method: 'post',
            url: '/api/annotation_task/create_project/',
            timeout: 100000,
            data: data,
            headers: {
              'Content-Type':'multipart/form-data',
              'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
            }

          }
        }).then(res=>{
          this.waiting = false
          if(res.status === 200){
            let result = res.data
            if(result['status'] === 'success'){
              alert('创建成功！')
              this.$destroy()
              this.$router.back()
              bus.$emit('update_project')
            }else{
              alert('创建失败\n'+result['error_msg'])
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>