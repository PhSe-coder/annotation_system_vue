<template>
  <div>
    <p style="line-height: 2" id="content">{{ text }}</p>
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
      handler: function (newValue) {
        this.setTags(newValue)
      },
    }
  },
  methods: {
    setTags(Data) {
      let tag = document.createElement('p')
      tag.style.lineHeight = '2'
      tag.id = 'content'
      tag.onmouseup = (ev) => {
        let ele = document.getElementById('content')
        if (!window.getSelection().anchorNode) {
          return
        }
        const range = window.getSelection().getRangeAt(0);
        let start, end = 0
        if (!range.collapsed) {
          const preSelectionRange = document.createRange()
          preSelectionRange.selectNodeContents(ele);
          preSelectionRange.setEnd(range.startContainer, range.startOffset);
          start = preSelectionRange.toString().length;
          end = start + range.toString().length;
          console.log(start, end);
          let isValid = true
          for (const item of Data) {
            if ((start >= item[2] && start < item[3]) || (end > item[2] && end <= item[3]) || (start <= item[2] && end >= item[3]))
              isValid = false
          }
          this.$store.commit('setSelectedIsValid', isValid)
          if (isValid) {
            this.$store.commit('setSelected', {start:start, end:end, text:range.toString()})
          }
        }
      }
      let nodeList = [0, 0]
      for (const datum of Data) {
        nodeList[1] = (datum[2])
        tag.append(this.text.slice(nodeList[0], nodeList[1]))
        let result = this.tags.find(value => {
          return value.type === datum[1]
        })
        let MyComponent = Vue.extend({
          // template不能换行，换行会有bug，会导致鼠标选中的文本的位置不对！
          template: "<b-badge style='font-size: inherit; font-weight: normal' :style='result.style'>{{ datum }}<b-avatar class='ml-1' button icon='x' variant='light' @click='deleteTag' :size='16'></b-avatar></b-badge>",
          // template: `
          //   <b-badge style="font-size: inherit; font-weight: normal" :style="result.style">{{ datum }}
          //   <b-avatar  button icon="x" variant="light" @click="deleteTag" :size="16"></b-avatar>
          //   </b-badge>`,
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
              bus.$emit('update_annotate', Data)
            },
          }
        })
        let component = new MyComponent().$mount()
        tag.append(component.$el)
        nodeList[0] = datum[3]
      }
      if (nodeList[0] !== this.text.length) {
        nodeList[1] = this.text.length
        tag.append(this.text.slice(nodeList[0], nodeList[1]))
      }
      let ele = document.getElementById('content')
      ele.replaceWith(tag)
      bus.$emit('update_annotate', Data)
    }
  }
}
</script>

<style scoped>

</style>