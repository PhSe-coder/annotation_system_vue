<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
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
      <div class="row">
        <div class="col-4">
          <b-table table-class="item-table" borderless thead-class="d-none" :items="data" :fields="field" :per-page="perPage" :current-page="currentPage">
            <template #cell(text)="data">
              <b-list-group-item href="javascript:void(0)" @click="setActive($event, data.index)" :class="{active: data.index + (currentPage-1)*perPage === activeItem}">
                <small>{{ data.item.text }}</small>
                <div class="d-flex justify-content-between align-items-center">
                  <span>
                    <span v-for="(value,i) in data.item.annotators">
                      <b-icon v-if="data.item.status[i] === 1" style="vertical-align: text-bottom"
                              icon="check-square"
                              variant="success" font-scale="1"></b-icon>
                      <b-icon v-else icon="x-square" style="vertical-align: text-bottom" variant="danger"
                              font-scale="1"></b-icon>
                      <small class="ml-2">{{ value }} </small>
                    </span>
                  </span>
                  <small class="font-weight-bold">3 days ago</small>
                </div>
              </b-list-group-item>
            </template>
          </b-table>
          <b-pagination class="mt-3" v-model="currentPage" :total-rows="data.length" :per-page="perPage"
                        align="center"></b-pagination>
        </div>
        <div class="col-8" id="annotation_content">
          <div class="container pt-2 tab_content " style="height: 70%">
            <p v-if="data[activeItem]">{{ data[activeItem]['text'] }}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center" style="height: 30%">
            <b-button @click="activeItem_minus" size="lg" class="mx-2" variant="secondary">
              <b-icon icon="arrow-left-circle"></b-icon>
            </b-button>
            <span>
              <b-button @click="annotate" size="lg" class="mx-2" variant="info">
              <b-icon icon="record-circle"></b-icon>
            </b-button>
              <b-button size="lg" class="mx-2" variant="danger">
              <b-icon icon="x"></b-icon>
            </b-button>
              <b-button size="lg" class="mx-2" variant="success">
              <b-icon icon="check"></b-icon>
            </b-button>
            </span>
            <b-button @click="activeItem_add" size="lg" class="mx-2" variant="secondary">
              <b-icon icon="arrow-right-circle"></b-icon>
            </b-button>
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
      currentPage:1,
      perPage: 4,
      project_info: {},
      data: [],
      field: [
        {key:'text',class:'p-0'}
      ]
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
    },
    annotate() {
      let formData = new FormData()
      formData.append('text', this.data[this.activeItem].text)
      request({
        config: {
          url: 'api/annotation_task/annotate/',
          method: 'post',
          data: formData,
          headers: {
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          },
          timeout: 10000
        }
      }).then(res => {

      })
    },
    activeItem_minus() {
      this.activeItem > 0 ? this.activeItem-- : this.activeItem
      this.currentPage =  Math.floor(this.activeItem/this.perPage + 1)
    },
    activeItem_add() {
      this.activeItem < this.data.length - 1 ? this.activeItem++ : this.activeItem
      this.currentPage = Math.floor(this.activeItem/this.perPage + 1)
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
      config: {
        url: 'api/annotation_task/get_project_overview/',
        method: 'get',
        params: {
          id: this.$route.query.id
        }
      }
    }).then(res => {
      this.project_info = res.data
    })
    // 这里必须要使用lambda表达式，不能写成function，否则由于作用域的问题会导致this指向改变
    $(document).keydown(e => {
      let keycode = e.keyCode
      if (keycode === 37 || keycode === 38) {
        this.activeItem_minus()
      } else if (keycode === 39 || keycode === 40) {
        this.activeItem_add()
      }
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
.item-table {
  height: 400px;
}
</style>