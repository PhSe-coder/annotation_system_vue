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
      <div class="col-8" id="annotation_content">
        <div class="d-flex bg-info my-2 py-2 pl-2">
          <b-badge v-for="tag in tags" :key="tag.keyChar" class="mr-2" :style="tag.style">{{ tag.type }}
            <b-badge variant="light" class="ml-2">
              {{ tag.keyChar }}
            </b-badge>
          </b-badge>
        </div>
        <div class="container pt-2 tab_content" style="height: 65%;position: relative;">
          <div v-if="isBusy">
            <div class="mask"></div>
            <div class="spinner">
              <b-spinner type="grow" variant="primary" style="width: 3rem; height: 3rem;"
                         label="Large Spinner"></b-spinner>
            </div>
          </div>
          <tag v-if="data[activeItem]" :key="activeItem" :tags="tags" :result="data[activeItem].result"
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
        {
          style: {
            backgroundColor: '#fecfdf',
            color: '#000000',
          },
          type: 'NR',
          keyChar: 'r'
        },
        {
          style: {
            backgroundColor: '#30309D',
            color: '#ffffff',
          },
          type: 'NS',
          keyChar: 's'
        },
        {
          style: {
            backgroundColor: '#297029',
            color: '#ffffff',
          },
          type: 'NT',
          keyChar: 't'
        },
        {
          style: {
            backgroundColor: '#FF0000',
            color: '#ffffff',
          },
          type: 'NZ',
          keyChar: 'z'
        },
      ],
    }
  },
  watch:{
    activeItem(newValue,oldVale){
      this.currentPage = Math.floor(newValue / this.perPage + 1)
    }
  },
  methods: {
    setActive(e, index) {
      this.activeItem = index + (this.currentPage-1)*this.perPage
    },
    annotate() {
      this.isBusy = true
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
        this.isBusy = false
        createAlert({alertType:'success',alertContent:'预标注成功！'})
        bus.$emit('annotate', res.data)
      },error => {
        console.log(error)
        createAlert({alertType:'danger',alertContent:'标注超时！'})
      })
    },
    save_annotate(status) {
      let index = this.data[this.activeItem].annotator_status.findIndex(value => {
        return value.annotator === this.$store.state.username
      })
      if(status === false){
        let result = window.confirm('是否清除所有标注项！\n（注：该操作将同步到服务器）')
        if(result){
          let length = this.data[this.activeItem].result.length
          this.data[this.activeItem].result.splice(0, length)
        }else{
          return
        }
      }
      this.data[this.activeItem].annotator_status[index].status = status
      this.isBusy = true
      let id = index+1
      request({
        config: {
          url: 'api/annotation_task/save_annotate/',
          method: 'post',
          data: {
            project_name: this.$route.query.id,
            text: this.data[this.activeItem].text,
            result: this.data[this.activeItem].result,
            annotator: 'annotator_status_'+id,
            status:status
          },
          headers: {
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          },
        }
      }).then(res => {
        this.isBusy = false
        createAlert({alertType:'success',alertContent:'保存成功！'})
        if(status) this.activeItem_add()
      })
    },
    activeItem_minus() {
      this.activeItem > 0 ? this.activeItem-- : this.activeItem
    },
    activeItem_add() {
      this.activeItem < this.data.length - 1 ? this.activeItem++ : this.activeItem
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
      } else if (this.tags.findIndex( value => {
        tagType = value.type
        return value.keyChar === keyChar
      }) !== -1 && this.$store.state.selectedIsValid) {
        let selected = this.$store.state.selected
        let index = this.data[this.activeItem].result.findIndex(value => {
          return selected.start < value[2]
        })
        if(index === -1)
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
}

</script>

<style scoped>
.item-overview {
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
</style>