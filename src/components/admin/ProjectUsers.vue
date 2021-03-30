<template>
  <div class="container mt-4">
    <b-table bordered :small="true" :busy="isBusy" striped hover :fields="fields" :items="items">
      <template #cell(ID)="data">
        {{data.index + 1}}
      </template>
      <template #custom-foot>
        <b-tr>
          <b-th colspan="5"><b-button @click="$bvModal.show('create-user')" block variant="secondary">新增用户</b-button></b-th>
        </b-tr>
        <b-modal id="create-user" title="创建用户" @ok="submit">
          <b-form id="user-form">
            <b-form-group id="input-group-1" label="用户名:" label-for="input-1">
              <b-form-input id="input-1" v-model="username" type="text" placeholder="请输入用户名" required></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="密码:" label-for="input-2">
              <b-form-input id="input-2" v-model="password" type="password" placeholder="请输入密码" required></b-form-input>
            </b-form-group>
          </b-form>
        </b-modal>
      </template>
    </b-table>
  </div>
</template>

<script>
import {request} from "../../network/request";

export default {
  name: "Users",
  created() {
    this.getData()
  },
  activated() {
    this.getData()
  },
  data() {
    return {
      isBusy:true,
      fields:[
          'ID','username','belonged','last_login','date_joined'
      ],
      items: [],
      username:'',
      password:''
    }
  },
  methods:{
    getData(){
      request({
        config:{
          url:'api/user/get_all_userinfo',
          method: 'get'
        }
      }).then(res => {
        this.isBusy = false
        this.items = res.data
      })
    },
    submit(){
      let data = new FormData()
      data.append('username', this.username)
      data.append('password', this.password)
      request({
        config:{
          url:'api/user/create_user/',
          method:'post',
          headers:{
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          },
          data:data
        }
      }).then(res => {
        let result = res.data
        if(result['status']==='success'){
          this.getData()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>