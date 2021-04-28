<template>
  <div class="container col-6">
    <div class="row my-4 justify-content-center">
      <h4 class="text-muted font-weight-bold">{{ title }}</h4>
    </div>
    <form @submit="create_project" novalidate>
      <div class="form-group">
        <label for="project_name">项目名称</label>
        <input v-model="project_name" type="text" class="form-control" id="project_name" placeholder="输入标注项目的名称"
               required>
      </div>
      <div class="form-group">
        <div class="col-form-label mb-1">标注类型</div>
        <div class="custom-control custom-radio custom-control-inline" v-for="type in project_types">
          <input :disabled="isDisabled" class="custom-control-input" v-model="project_type" type="radio"
                 name="project_type" :id="type" :value="type" required>
          <label class="custom-control-label" :for="type">{{ type }}</label>
        </div>
      </div>
      <div class="form-group">
        <label for="project_members">标注成员</label>
        <select v-model="project_members" id="project_members" class="custom-select" size="4" multiple required>
          <option v-for="user in users" :value="user['username']">{{ user['username'] }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="project_tags">
          项目标签
          <b-button class="bg-secondary" size="sm">添加</b-button>
        </label>
        <input v-model="project_tags" type="text" class="form-control" id="project_tags" placeholder="标注项目的标签"
               required>
      </div>
      <div class="form-group">
        <label for="project_description">项目描述</label>
        <textarea type="text" class="form-control" rows="3" style="resize: none" id="project_description"
                  placeholder="输入标注项目的描述内容" v-model="project_description"></textarea>
      </div>
      <div class="form-group">
        <label for="project_file">标注文件</label>
        <div class="custom-file">
          <input @change="get_file" type="file" accept=".txt" class="custom-file-input" id="project_file" lang="zh" required>
          <label class="custom-file-label" for="project_file" data-browse='上传'>Choose file</label>
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-block" :disabled="waiting">
        <span v-if="!waiting">{{ title.substring(0, 2) }}</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...
        </span>
      </button>
    </form>
    <b-modal>

    </b-modal>
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
        method: 'get',
        url: '/api/user/get_username/',
      }
    }).then(res => {
      this.users = res.data
    })
  },
  data() {
    return {
      waiting: false,
      project_types: ["命名实体标注", "词性标注"],
      users: [],
      project_name: this.name,
      project_file: '',
      project_type: this.type,
      project_members: this.members,
      project_tags: this.tags,
      project_description: this.description

    }
  },
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
      required: false
    },
    name: {
      type: String,
      default: '',
      required: false
    },
    title: {
      type: String,
      default: '创建项目',
      required: false
    },
    members: {
      type: Array,
      default: () => [],
      required: false
    },
    description: {
      type: String,
      default: '这是一个文本标注项目',
      required: false
    },
    tags: {
      type: Array,
      default: () => [],
      required: false
    },
    type: {
      type: String,
      default: '',
      required: false
    }
  },
  methods: {
    get_file(e) {
      this.project_file = e.target.files[0]
      console.log(this.project_file);
    },
    create_project(e) {
      let target = e.target
      e.preventDefault();
      if (target.checkValidity() === false) {
        target.classList.add('was-validated');
      } else {
        let data = new FormData()
        data.append('project_name', this.project_name)
        data.append('project_file', this.project_file)
        data.append('project_type', this.project_type)
        data.append('project_members', this.project_members)
        data.append('project_description', this.project_description)
        this.waiting = true
        let url = '/api/annotation_task/create_project/'
        if (this.title === '更新项目') {
          data.delete('project_type')
          data.append('project_origin_name', this.name)
          data.append('project_origin_members', this.members.toString())
          url = '/api/annotation_task/update_project/'
        }
        request({
          config: {
            method: 'post',
            url: url,
            timeout: 100000,
            data: data,
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
            }

          }
        }).then(res => {
          this.waiting = false
          if (res.status === 200) {
            let result = res.data
            if (result['status'] === 'success') {
              alert(this.title.substring(0, 2) + '成功！')
              this.$destroy()
              this.$router.replace({name: 'admin_project'}).catch(err => {
              })
              this.$bvModal.hide('modal_edit' + this.name)
              bus.$emit('update_project')
            } else {
              alert('创建失败\n' + result['error_msg'])
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