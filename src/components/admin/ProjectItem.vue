<template>
  <div class="col-md-6 rol-xl-3">
    <div class="card">
      <div class="card-header">
        <span>{{ name }}</span>
        <b-dropdown variant="none" no-caret left style="color: inherit">
          <template #button-content>
            <i class="fa fa-cog"></i>
          </template>
          <b-dropdown-item>
            <i class="fa fa-pencil-square mr-1" aria-hidden="true"></i>Edit
          </b-dropdown-item>
          <b-dropdown-item @click="$bvModal.show('modal'+name)">
            <i class="fa fa-trash mr-1" aria-hidden="true"></i>Delete
          </b-dropdown-item>
        </b-dropdown>
        <b-modal :id="'modal'+name" title="警告" size="sm" @ok="deleteProject($event,name)">
          是否删除该项目
        </b-modal>
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
          <h6 class="card-text col-4 text-right">{{ task_progress }}%</h6>
        </div>
        <div class="progress">
          <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar"
               :style="{width: task_progress+'%'}" :aria-valuenow="task_progress"
               aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
      <div class="card-footer">
        <h6 class="text-muted mt-2 mb-2 card-description" v-b-tooltip.hover :title="description">
          {{ description }}&nbsp;
        </h6>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from "../../network/request";
import bus from "../bus";

export default {
  name: "ProjectItem",
  computed:{
    task_progress(){
      console.log(this.progress.toFixed(2)*100)
      return this.progress.toFixed(2)*100
    }
  },
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
    description: {
      type: String,
      default: '这是一个文本标注项目',
      required: false
    },
    progress: {
      type: Number,
      default: 0,
      required: true
    }
  },
  methods: {
    deleteProject(e, name) {
      console.log(name)
      request({
        config: {
          method: 'get',
          url: '/api/annotation_task/delete_project',
          params: {
            project_name: name
          }
        }
      }).then(res => {
        bus.$emit('update_project')
      })
    }
  },
  mounted() {
    $(".card").hover(function () {
      $(this).addClass('shadow').css('transition', 'all 0.5s');
    }, function () {
      $(this).removeClass('shadow');
    })
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