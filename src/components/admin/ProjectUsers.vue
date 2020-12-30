<template>
  <div class="container mt-4">
    <b-table bordered :busy="isBusy" striped hover :fields="fields" :items="items">
      <template #cell(ID)="data">
        {{data.index + 1}}
      </template>
    </b-table>
  </div>
</template>

<script>
import {request} from "../../network/request";

export default {
  name: "Users",
  created() {
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
  data() {
    return {
      isBusy:true,
      fields:[
          'ID','username','belonged','last_login','date_joined'
      ],
      items: []
    }
  }
}
</script>

<style scoped>

</style>