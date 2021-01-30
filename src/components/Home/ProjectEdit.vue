<template>
  <main class="container mt-3">
    <div class="row">
      <div class="col-4">
        <b-table table-class="item-table" borderless thead-class="d-none" :items="data" :fields="field"
                 :per-page="perPage" :current-page="currentPage">
          <template #cell(text)="data">
            <b-list-group-item href="javascript:void(0)" @click="setActive($event, data.index)"
                               :class="{active: data.index + (currentPage-1)*perPage === activeItem}">
              <small :title="data.item.text" class="item-overview">{{ data.item.text }}</small>
              <div class="d-flex justify-content-between align-items-center">
                <span>
                    <span v-for="(value,i) in data.item['annotator_status']">
                      <b-icon v-if="value.status === true" style="vertical-align: text-bottom"
                              icon="check-square"
                              variant="success" font-scale="1"></b-icon>
                      <b-icon v-else icon="x-square" style="vertical-align: text-bottom" variant="danger"
                              font-scale="1"></b-icon>
                      <small class="ml-2">{{ value.annotator }} </small>
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
      <div class="col-8">
        <div class="badge-parent bg-info pl-1">
          <b-icon-three-dots class="dot" v-if="childHeight !== parentHeight" @click="dropdown"></b-icon-three-dots>
          <b-badge v-for="tag in tags" :title="tag.tagName" :key="tag.tagKey" class="badge-child" :style="tag.style">{{ tag.tag }}
            <b-badge variant="light" class="ml-2">
              {{ tag.tagKey }}
            </b-badge>
          </b-badge>
        </div>
        <div class="container pt-2 tab-content">
          <div v-if="isBusy">
            <div class="mask"></div>
            <div class="spinner">
              <b-spinner type="grow" variant="primary" style="width: 3rem; height: 3rem;"
                         label="Large Spinner"></b-spinner>
            </div>
          </div>
          <tag v-if="data[activeItem] && tags.length !== 0" :key="activeItem" :tags="tags" :result="data[activeItem].result"
               :text="data[activeItem].text"></tag>
        </div>
        <div class="d-flex justify-content-between align-items-md-baseline" style="height: 25%">
          <b-button title="前一项" @click="activeItem_minus" size="lg" class="mx-2" variant="secondary">
            <b-icon icon="arrow-left-circle"></b-icon>
          </b-button>
          <span>
              <b-button title="算法预标注" @click="annotate" size="lg" class="mx-2" variant="info">
              <b-icon icon="record-circle"></b-icon>
            </b-button>
              <b-button title="删除当前项所有的标注内容" @click="save_annotate(false)" size="lg" class="mx-2" variant="danger">
              <b-icon icon="x"></b-icon>
            </b-button>
              <b-button title="保存标注结果" @click="save_annotate(true)" size="lg" class="mx-2" variant="success">
              <b-icon icon="check"></b-icon>
            </b-button>
            </span>
          <b-button title="后一项" @click="activeItem_add" size="lg" class="mx-2" variant="secondary">
            <b-icon icon="arrow-right-circle"></b-icon>
          </b-button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {request} from "../../network/request";
import Tag from "./AnnotateContent";
import bus from "../bus";
import {createAlert} from "../../script/alert";
export default {
  name: "ProjectEdit",
  components: {Tag},
  data() {
    return {
      activeItem: 0,
      currentPage: 1,
      perPage: 4,
      isBusy: false,
      data: [],
      field: [
        {key: 'text', class: 'p-0'}
      ],
      tags: [
        // {
        //   style: {
        //     backgroundColor: '#fecfdf',
        //     color: '#000000',
        //   },
        //   tag: 'NR',
        //   tagKey: 'r'
        // },
        // {
        //   style: {
        //     backgroundColor: '#30309D',
        //     color: '#ffffff',
        //   },
        //   tag: 'NS',
        //   tagKey: 's'
        // },
        // {
        //   style: {
        //     backgroundColor: '#297029',
        //     color: '#ffffff',
        //   },
        //   tag: 'NT',
        //   tagKey: 't'
        // },
      ],
      childHeight:0,
      parentHeight:0,
    }
  },
  watch: {
    activeItem(newValue, oldVale) {
      this.currentPage = Math.floor(newValue / this.perPage + 1)
    }
  },
  methods: {
    setActive(e, index) {
      this.activeItem = index + (this.currentPage - 1) * this.perPage
    },
    annotate() {
      this.isBusy = true
      let formData = new FormData()
      formData.append('type', this.$store.state.tagInfo.project_type)
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
        this.isBusy = false
        if (res.status === 200) {
          createAlert({alertType: 'success', alertContent: '预标注成功！'})
          bus.$emit('annotate', res.data)
        }else{
          createAlert({alertType: 'danger', alertContent: '标注失败！'})
        }
      }, error => {
        this.isBusy = false
        createAlert({alertType: 'danger', alertContent: '标注超时！'})
      })
    },
    save_annotate(status) {
      let index = this.data[this.activeItem].annotator_status.findIndex(value => {
        return value.annotator === this.$store.state.username
      })
      if (status === false) {
        let result = window.confirm('是否清除所有标注项！\n（注：该操作将同步到服务器）')
        if (result) {
          let length = this.data[this.activeItem].result.length
          this.data[this.activeItem].result.splice(0, length)
        } else {
          return
        }
      }
      this.data[this.activeItem].annotator_status[index].status = status
      this.isBusy = true
      let id = index + 1
      request({
        config: {
          url: 'api/annotation_task/save_annotate/',
          method: 'post',
          data: {
            project_name: this.$route.query.id,
            text: this.data[this.activeItem].text,
            result: this.data[this.activeItem].result,
            annotator: 'annotator_status_' + id,
            status: status
          },
          headers: {
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          },
        }
      }).then(res => {
        this.isBusy = false
        createAlert({alertType: 'success', alertContent: '保存成功！'})
        if (status) this.activeItem_add()
      })
    },
    activeItem_minus() {
      this.activeItem > 0 ? this.activeItem-- : this.activeItem
    },
    activeItem_add() {
      this.activeItem < this.data.length - 1 ? this.activeItem++ : this.activeItem
    },
    dropdown(){
      let parent_ele = $('.badge-parent')
      let child_ele = $('.badge-child')
      let tab_content = $('.tab-content')
      console.log(tab_content.parent().height());
      let height = child_ele[0].clientHeight + 2 * parseInt(child_ele.css('margin'))
      let tab_contentHeight = (tab_content.height()-(parent_ele[0].scrollHeight-parent_ele.height()))
      console.log(tab_contentHeight/tab_content.parent().height())
      if(parent_ele.height() !== parent_ele[0].scrollHeight){
        tab_content.css('height', tab_contentHeight/tab_content.parent().height()*100 + '%')
        parent_ele.css('height', parent_ele[0].scrollHeight)
      } else{
        parent_ele.css('height', height)
        tab_content.css('height', '65%' )
      }
    },
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
    // 这里必须要使用lambda表达式，不能写成function，否则由于作用域的问题会导致this指向改变
    $(document).keydown(e => {
      let keyCode = e.keyCode
      let keyChar = e.key
      let tagType = ''
      if (keyCode === 37 || keyCode === 38) {
        this.activeItem_minus()
      } else if (keyCode === 39 || keyCode === 40) {
        this.activeItem_add()
      } else if (keyCode === 13) {
        e.preventDefault()
        this.save_annotate(true)
      } else if (this.tags.findIndex(value => {
        tagType = value.tag
        return value.tagKey === keyChar
      }) !== -1 && this.$store.state.selectedIsValid) {
        let selected = this.$store.state.selected
        let index = this.data[this.activeItem].result.findIndex(value => {
          return selected.start < value[2]
        })
        if (index === -1)
          index = this.data[this.activeItem].result.length
        this.data[this.activeItem].result.splice(index, 0, [selected.text, tagType, selected.start, selected.end])
        this.$store.commit('setSelectedIsValid', false)
        window.getSelection().empty()
      }
    })
    bus.$on('update_annotate', (annotate_result) => {
      this.$set(this.data[this.activeItem], 'result', annotate_result)
    })
  },
  mounted() {
    bus.$on('get_tags',()=>{
      request({
        config: {
          url: 'api/tag_manager/get_tags',
          method: 'get',
          params: {
            tagType: this.$store.state.tagInfo.project_type
          }
        }
      }).then(res => {
        this.tags = res.data[this.$store.state.tagInfo.project_type]
        console.log(this.tags)
        this.$nextTick(()=>{
          let child_ele = $('.badge-child')
          let parent_ele = $('.badge-parent')
          parent_ele.css('height', child_ele[0].clientHeight + 2 * parseInt(child_ele.css('margin')))
          this.childHeight = child_ele[0].clientHeight + 2 * parseInt(child_ele.css('margin'))
          this.parentHeight = parent_ele[0].scrollHeight
        })
      })
    })
  },
  // 销毁时清除事件，否则会导致事件在单次emit后被执行多次
  beforeDestroy() {
    bus.$off('get_tags')
  }
}

</script>

<style scoped>
.item-overview {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.tab-content {
  position: relative;
  height: 65%;
  min-height: 40%;
  box-shadow: 0 0 5px #888888;
  transition: height 0.6s ease-in-out;
}

.item-table {
  height: 400px;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(247, 247, 247, 1);
  opacity: 0.5;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.badge-parent {
  position: relative;
  display: flex;
  flex-wrap:wrap;
  overflow: hidden;
  height: unset;
  transition: height 0.6s ease-in-out;
}
.badge-child {
  width: 8%;
  margin: 0.25rem;
}

.dot {
  position: absolute;
  cursor: pointer;
  color: white;
  top: 50%;
  right: 1%;
  transform: translate(0, -50%);
}
</style>