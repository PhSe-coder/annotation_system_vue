<template>
  <div>
    <b-navbar toggleable="lg" class="" type="dark" variant="dark">
      <b-navbar-brand href="#">{{ project_info.project_name }}</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-text>{{ project_info.project_type }}</b-nav-text>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              {{ $store.state.username }}
            </template>
            <b-dropdown-item href="#">个人信息</b-dropdown-item>
            <b-dropdown-item @click="logout">退出登录</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <main class="container mt-3">
      <!--      <b-tabs vertical pills nav-wrapper-class="col-4" >-->
      <!--        <b-tab v-for="(item,index) in data" :key="item.id" title-link-class="tab_content">-->
      <!--          <template #title>-->
      <!--            <div class="d-flex w-100 justify-content-between">-->
      <!--              <h5 class="mb-1">Task {{ item.id }}</h5>-->
      <!--              <small>3 days ago</small>-->
      <!--            </div>-->
      <!--            <p class="mb-1">{{ item.text }}</p>-->
      <!--            <span v-for="(value,i) in item.annotators">-->
      <!--                              <b-icon v-if="item.status[i] === 1" style="vertical-align: text-bottom"-->
      <!--                                      icon="check-square"-->
      <!--                                      variant="success" font-scale="1"></b-icon>-->
      <!--                              <b-icon style="vertical-align: text-bottom" v-else icon="x-square" variant="danger"-->
      <!--                                      font-scale="1"></b-icon>-->
      <!--                              <small class="ml-2">{{ value }} </small>-->
      <!--                            </span>-->
      <!--          </template>-->
      <!--          <p class="p-3">{{ item.text }}</p>-->
      <!--        </b-tab>-->
      <!--      </b-tabs>-->
      <div class="row">
        <b-list-group id="list-group" class="col-4">
          <b-list-group-item href="#" v-for="(item,index) in data" :key="item.id"
                             @click="setActive($event, index)"
                             :class="{active: index === activeItem}"
                             class="flex-column align-items-start">
            <!--            <div class="d-flex w-100 justify-content-between">-->
            <!--              <h5 class="mb-1">Task {{ item.id }}</h5>-->
            <!--              <small>3 days ago</small>-->
            <!--            </div>-->
            <p class="mb-1 small">{{ item.text }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span>
                <span v-for="(value,i) in item.annotators">
                  <b-icon v-if="item.status[i] === 1" style="vertical-align: text-bottom" icon="check-square"
                          variant="success" font-scale="1"></b-icon>
                  <b-icon v-else icon="x-square" style="vertical-align: text-bottom" variant="danger"
                          font-scale="1"></b-icon>
                  <small class="ml-2">{{ value }} </small>
                </span>
              </span>
              <small class="font-weight-bold">3 days ago</small>
            </div>
          </b-list-group-item>
        </b-list-group>
        <div class="col-8" id="annotation_content">
          <div class="container pt-2 tab-content tab_content " style="height: 80%">
            <div v-for="(item,index) in data" :key="item.id" class="tab-pane fade"
                 :class="{show:index === activeItem, active:index === activeItem}">{{ item.text }}
            </div>
          </div>
          <div class="d-flex justify-content-center align-items-center" style="height: 20%">
            <b-button size="lg" class="mx-2" variant="info"><b-icon icon="record-circle"></b-icon></b-button>
            <b-button size="lg" class="mx-2" variant="danger"><b-icon icon="x"></b-icon></b-button>
            <b-button size="lg" class="mx-2" variant="success"><b-icon icon="check"></b-icon></b-button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import {request} from "../../network/request";

export default {
  name: "ProjectEdit",
  data() {
    return {
      activeItem: 0,
      project_info: {},
      data: ''
    }
  },
  methods: {
    logout() {
      request({
        config: {
          url: '/api/user/logout/',
          method: 'post',
          headers: {
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          }
        }
      }).then(res => {
        let result = res.data
        if (result.status === 'success') {
          window.location.reload()
        }
      })
    },
    setActive(e, index) {
      this.activeItem = index
    },
    linkClass(index) {
      if (this.activeItem === index) {
        return ['bg-primary', 'text-light']
      } else {
        return ['bg-light', 'text-info']
      }
    }
  },
  beforeRouteEnter: (to, from, next) => {
    let id = to.query.id
    if (id === undefined || id === '')
      next({name: 'Page404', params: {'0': to.path}})
    request({
      config: {
        url: 'api/annotation_task/get_project_detail/',
        method: 'get',
        params: {
          id: id
        }
      }
    }).then(res => {
      if (res.data.status === 'failure') {
        next({name: 'Page404', params: [to.path], query: to.query})
      } else {
        next(vm => {
          vm.data = res.data
        })
      }
    })
  },
  created() {
    request({
      config:{
        url: 'api/annotation_task/get_project_overview/',
        method: 'get',
        params: {
          id: this.$route.query.id
        }
      }
    }).then(res => {
      this.project_info = res.data
    })
  }
}

</script>

<style scoped>
p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.tab_content {
  box-shadow: 0 0 5px #888888;
}
</style>