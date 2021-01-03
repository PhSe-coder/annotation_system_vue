<template>
  <div>
    <p id="content">{{ html_content }}</p>
  </div>
</template>

<script>
import bus from "../bus";
import Vue from "vue/dist/vue.esm";
import {BAvatar, BBadge} from "bootstrap-vue";

export default {
  name: "AnnotateContent",
  data() {
    return {
      html_content: this.text,
    }
  },
  props: {
    text: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      required: true
    },
    result: {
      type: Array,
      default: []
    }
  },
  created() {
    bus.$on('annotate', (resData) => {
      this.setTags(resData)
    })
  },
  mounted() {
    if (this.result.length !== 0) {
      this.setTags(this.result)
    }
  },
  watch: {
    result: {
      handler: function (newValue, oldValue) {
        this.setTags(newValue)
      },
      deep:true
    }
  },
  methods: {
    setTags(Data) {
      let tag = document.createElement('p')
      tag.style.lineHeight = '2'
      tag.id = 'content'
      let nodeList = [0, 0]
      for (const datum of Data) {
        nodeList[1] = (datum[2])
        tag.appendChild(document.createTextNode(this.text.slice(nodeList[0], nodeList[1])))
        let result = this.tags.find(value => {
          return value.type === datum[1]
        })
        let MyComponent = Vue.extend({
          template: `
            <b-badge style="font-size: inherit; font-weight: normal" :style="result.style">{{ datum }}
            <b-avatar button @click="deleteTag" icon="x" variant="light" :size="16"></b-avatar>
            </b-badge>`,
          components: {
            BBadge, BAvatar
          },
          data() {
            return {
              datum: datum[0],
              result: result,
            }
          },
          methods: {
            deleteTag() {
              let index = Data.findIndex(value => {
                return value[0] === this.datum
              })
              Data.splice(index, 1)
              bus.$emit('set_annotate', Data)
            },
          }
        })
        let component = new MyComponent().$mount()
        tag.appendChild(component.$el)
        nodeList[0] = datum[3]
      }
      if (nodeList[0] !== this.text.length) {
        nodeList[1] = this.text.length
        tag.appendChild(document.createTextNode(this.text.slice(nodeList[0], nodeList[1])))
      }
      let ele = document.getElementById('content')
      ele.replaceWith(tag)
      bus.$emit('set_annotate', Data)
    }
  }
}
</script>

<style scoped>

</style>