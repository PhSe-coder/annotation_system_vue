<template>
  <div>
    <div v-for="projectInfo_item in projectInfo" class="row mb-3">
      <project-item v-for="item in projectInfo_item" :key="item['project_name']" class="col-6"
                    :description="item['project_description']" :name="item['project_name']"
                    :type="item['project_type']" :tasks="item['count']"
                    :members="item['project_members']" :progress="item['project_progress']"></project-item>
    </div>
  </div>
</template>

<script>
import ProjectItem from "./ProjectItem";
import {request} from "../../network/request";
import bus from "../bus";

$(document).ready(function () {
  $(document).on('mouseenter', '[data-toggle="tooltip"]', function () {
    let content = $(this)[0].innerText
    $(this).tooltip({
      container: 'body',
      title: content
    }).tooltip('show')
  })
  $(".card").hover(function () {
    $(this).addClass('shadow').css('transition', 'all 0.4s');
  }, function () {
    $(this).removeClass('shadow');
  })
  let myModal = new window.bootstrap.Modal(document.getElementById('staticBackdrop_project_1'), {
    focus: true,
    keyboard: false
  })
  myModal.show()
})
export default {
  name: "ProjectList",
  data() {
    return {
      projectInfo: []
    }
  },
  components: {
    ProjectItem
  },
  methods: {
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
    }
  },
  created() {
    this.get_project_list()
    bus.$on("update_project", () => {
      this.get_project_list()
    })
  }
}
</script>

<style scoped>

</style>