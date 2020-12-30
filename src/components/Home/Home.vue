<template>
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
    edit(e, name) {
      console.log(e)
      console.log(name)
    }
  }
}
</script>

<style scoped>

</style>