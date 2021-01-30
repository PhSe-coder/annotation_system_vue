<template>
  <div class="container">
    <div v-for="(value,key,index) in items" :key="key">
      <b-modal :id="'add-tag-'+index" title="新增标签" hide-footer>
        <b-form @submit.prevent="submit(index)">
          <b-form-group label-cols="auto" label="标签类型：" label-for="tag-type">
            <b-form-input readonly id="tag-type" v-model="form.type" required></b-form-input>
          </b-form-group>
          <b-form-group label-cols="auto" label="标签名：" label-for="tag">
            <b-form-input id="tag" v-model="form.tag" type="text" placeholder="Enter tag" required></b-form-input>
          </b-form-group>
          <b-form-group label-cols="auto" label="标签含义：" label-for="tag-name">
            <b-form-input id="tag-name" v-model="form.tagName" placeholder="Enter tag name" required></b-form-input>
          </b-form-group>
          <b-form-group label-cols="auto" label="快捷键：" label-for="tag-key">
            <b-form-input id="tag-key" v-model="form.tagKey" required></b-form-input>
          </b-form-group>
          <b-row>
            <b-col>
              <b-form-group label-cols="auto" label="背景颜色：" label-for="tag-backgroundColor">
                <b-form-input type="color" id="tag-backgroundColor" v-model="form.style.backgroundColor" required></b-form-input>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label-cols="auto" label="字体颜色：" label-for="tag-color">
                <b-form-input type="color" id="tag-color" v-model="form.style.color" required></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group label-cols="auto" label="效果预览：">
            <b-badge class="mt-2" :style="form.style">example</b-badge>
          </b-form-group>
          <div class="text-right">
            <b-button class="mr-2" type="submit" variant="primary">确定</b-button>
            <b-button type="reset" variant="danger">重置</b-button>
          </div>

        </b-form>
      </b-modal>
      <h5 :id="key" class="my-4 d-flex align-items-center">
        <a :href="'#'+key" onclick="this.parentNode.scrollIntoView()">
          <b-icon icon="link45deg"></b-icon>
        </a>
        <span class="ml-2">{{ map[key] }}</span>
        <b-button @click="form.type = key" v-b-modal="'add-tag-'+index" class="ml-auto" variant="primary">新增标签</b-button>
      </h5>
      <b-table :id="'table'+key" :current-page="currentPage[index]" :per-page="perPage" :items="value" :fields="fields">
        <template #cell(tagKey)="data">
          <b-avatar @click="updateKey($event,data,`popover-${key}-${data.index}`,key)" title="点击修改快捷键" :id="`popover-${key}-${data.index}`"  variant="light" button :size="30" :text="data.item.tagKey"></b-avatar>
          <b-popover :target="`popover-${key}-${data.index}`" placement='right' title="键盘输入快捷键" triggers="focus"></b-popover>
        </template>
        <template #cell(backgroundColor)="data">
          <input type="color" v-model="data.item.style.backgroundColor">
        </template>
        <template #cell(color)="data">
          <input type="color" v-model="data.item.style.color">
        </template>
        <template #cell(result)="data">
          <b-badge :style="data.item.style">example</b-badge>
        </template>
        <template #cell(option)="data">
          <b-button @click="reset(data,key)" variant="info" size="sm">还原</b-button>
          <b-button class="mx-2" @click="save(data.item)" variant="success" size="sm">保存</b-button>
          <b-button @click="remove(data.item)" variant="danger" size="sm">删除</b-button>
        </template>
      </b-table>
      <b-pagination class="justify-content-center" v-model="currentPage[index]" :total-rows="value.length" :per-page="perPage" :aria-controls="'table'+key"></b-pagination>
    </div>
  </div>
</template>

<script>
import {createAlert} from "../../script/alert";
import {request} from "../../network/request";

export default {
  name: "TagManager",
  data() {
    return {
      perPage: 5,
      currentPage: [],
      form: {
        type:null,
        tag:'',
        tagName: '',
        tagKey: '',
        style:{
          backgroundColor:'#000000',
          color:'#ffffff'
        }
      },
      map:{
        NER:'命名实体标注',
        POS:'词性标注',
      },
      types:[{text:'请选择',value:null},'NER','POS'],
      fields: [
        {
          key: 'tag',
          label: '标签'
        },
        {
          key: 'tagName',
          label: '含义',
          thStyle:{width:'10rem'}
        },
        {
          key: 'tagKey',
          label: '快捷键',
        },
        {
          key: 'backgroundColor',
          label: '背景色'
        },
        {
          key: 'color',
          label: '字体颜色'
        },
        {
          key: 'result',
          label: '效果预览'
        },
        {
          key: 'option',
          label: '操作'
        }
      ],
      items: [
        // {tag: 'NZ', tagName: '其他专名', tagKey: 'z', style: {backgroundColor: '#FF0000', color: '#ffffff'}},
      ],
      origin_item:[
        // {tag: 'NZ', tagName: '其他专名', tagKey: 'z', style: {backgroundColor: '#FF0000', color: '#ffffff'}},
      ],
    }
  },
  methods:{
    save(data){
      request({
        config:{
          url:'api/tag_manager/update_tag/',
          method:'post',
          data:{
            type:data.type,
            tag:data.tag,
            tagName: data.tagName,
            tagKey: data.tagKey,
            style:data.style
          },
          headers: {
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          },
        }
      }).then(res => {
        createAlert({alertType: 'success', alertContent: '保存成功！'})
      })
    },
    reset(data,key){
      console.log(this.origin_item[key])
      this.$set(data.item,'tagKey',this.origin_item[key][data.index].tagKey)
      // 深拷贝
      for (const itemKey in data.item.style) {
        if(data.item.style.hasOwnProperty(itemKey)){
          data.item.style[itemKey] = this.origin_item[key][data.index].style[itemKey]
        }
      }
    },
    remove(data){
      let isDelete=window.confirm("确认删除？")
      if(isDelete)
        request({
          config:{
            url:'api/tag_manager/delete_tag/',
            method:'post',
            data:{
              type:data.type,
              tag:data.tag,
            },
            headers: {
              'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
            },
          }
        }).then(res => {
          this.get_tags()
          createAlert({alertType: 'success', alertContent: '删除成功！'})
        })
    },
    submit(index){
      request({
        config:{
          url:'api/tag_manager/save_tag/',
          method:'post',
          data:this.form,
          headers: {
            'X-XSRF-TOKEN': this.$cookies.get('csrftoken')
          },
        }
      }).then(res => {
        let data = res.data
        if(data.status === 'success'){
          this.$bvModal.hide('add-tag-'+index)
          this.get_tags()
          createAlert({alertType:'success',alertContent:`创建成功！`})
        }else{
          alert(data.msg)
        }
      })
    },
    updateKey(ev,data,id,keyValue){
      document.getElementById(id).addEventListener('keyup', (e)=>{
        let key = e.key
        let itemIndex = 0
        let result = this.items[keyValue].findIndex((value,index) => {
          itemIndex = index
          return value.tagKey === key
        })
        if( result=== -1||result === data.index){
          data.item.tagKey = key
        } else{
          createAlert({alertType:'danger',alertContent:`设置失败，快捷键重复！`})
        }
      })
    },
    get_tags(){
      request({
        config:{
          url:'api/tag_manager/get_tags',
          method:'get'
        }
      }).then(res => {
        this.items = res.data
        for (const itemsKey in this.items) {
          // 对象数组深拷贝
          if(this.items.hasOwnProperty(itemsKey)){
            let result = []
            for (const item of this.items[itemsKey]) {
              let obj = {}
              for (const itemKey in item) {
                if(item.hasOwnProperty(itemKey)){
                  if(item[itemKey] instanceof Object){
                    obj[itemKey] = {}
                    for (const itemKey1 in item[itemKey]) {
                      if(item[itemKey].hasOwnProperty(itemKey1))
                        obj[itemKey][itemKey1] = item[itemKey][itemKey1]
                    }
                  }else{
                    obj[itemKey] = item[itemKey]
                  }
                }
              }
              result.push(obj)
            }
            this.origin_item[itemsKey] = result
          }
          // 给每个对象设置currentPage
          this.currentPage.push(1)
        }
      })
    }
  },
  created(){
    this.get_tags()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>