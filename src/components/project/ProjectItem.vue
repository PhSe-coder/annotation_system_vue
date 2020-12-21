<template>
  <div class="col-md-6 rol-xl-3">
    <div class="card">
      <div class="card-header d-flex">
        <span>{{ name }}</span>
        <div class="d-inline-block text-right flex-grow-1">
          <a class="btn fa fa-cog text-decoration-none" style="color: inherit" data-toggle="dropdown"
             aria-haspopup="true" aria-expanded="false" aria-hidden="true"></a>
          <div class="dropdown-menu dropdown-menu-right" style="max-width: 50px">
            <a class="btn dropdown-item">
              <i class="fa fa-pencil-square mr-1" aria-hidden="true"></i>
              Edit
            </a>
            <a class="btn dropdown-item" @click="deleteProject($event,name)">
              <i class="fa fa-trash mr-1" aria-hidden="true"></i>
              Delete</a>
          </div>
        </div>
      </div>
      <div class="card-body text-muted">
        <span v-if="progress.toFixed() === '100'" class="badge badge-success">Finished</span>
        <span v-else class="badge badge-secondary">Ongoing</span>
        <div class="row mb-3 mt-2">
          <div class="col-3">
            <i class="fa fa-tasks mr-1" aria-hidden="true"></i>
            <b>{{ tasks }}</b>
            Tasks
          </div>
          <div class="col-4">
            <i class="fa fa-users mr-1" aria-hidden="true"></i>
            <b>{{ members }}</b>
            Members
          </div>
          <div class="col-5">
            <i class="fa fa-pencil mr-1" aria-hidden="true"></i>
            <b>{{ type }}</b>
            type
          </div>
        </div>
        <div class="row">
          <h6 class="card-text col-8">Progress</h6>
          <h6 class="card-text col-4 text-right">{{ progress.toFixed() }}%</h6>
        </div>
        <div class="progress">
          <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar"
               :style="{width: progress.toFixed()}" :aria-valuenow="progress.toFixed()"
               aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
      <div class="card-footer">
        <h6 class="text-muted mt-2 mb-2 card-description" data-toggle="tooltip" data-placement="bottom">
          {{ description }}
        </h6>
      </div>
    </div>
    <div class="modal fade" :id="'staticBackdrop_'+name" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Understood</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {request} from "../../network/request";
import bus from "../bus";

export default {
  name: "ProjectItem",
  props: {
    name: {
      type: String,
      default: '标注项目',
      required: true
    },
    type: {
      type: String,
      default: '词性标注',
      required: true
    },
    tasks: {
      type: Number,
      default: 12,
      required: true
    },
    members: {
      type: Number,
      default: 3,
      required: true
    },
    description:{
      type: String,
      default: '这是一个文本标注项目',
      required: false
    },
    progress:{
      type: Number,
      default: 0,
      required: true
    }
  },
  methods: {
    deleteProject(e, name){
      console.log(name)
      request({
        config:{
          method: 'get',
          url:'/api/annotation_task/delete_project',
          params:{
            project_name:name
          }
        }
      }).then(res => {
        bus.$emit('update_project')
      })
    }
  }
}
</script>

<style scoped>
.card-description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>