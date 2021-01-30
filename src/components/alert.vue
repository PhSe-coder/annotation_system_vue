<template>
  <b-alert @dismissed="dismissed" class="annotation_alert" :show="dismissCountDown" fade :variant="alertType" @dismiss-count-down="countDownChanged">
    <b-icon icon="exclamation-triangle"></b-icon>
    {{ alertContent }}
  </b-alert>
</template>

<script>
import Login from "../views/Login";

export default {
name: "alert",
  props:{
    dismissCountDown:{
      type: Number,
      required:false,
      default:1
    },
    alertType:{
      type: String,
      required:true
    },
    countDownChanged:{
      type:Function,
      default:()=>{},
      required:false,
    },
    alertContent:{
      type:String,
      required:false
    }
  },
  destroyed() {
    document.body.childNodes.forEach((value, key, parent) => {
      if(value.nodeType === 8 && key+1 === parent.length) value.remove()
    })
  },
  methods:{
    dismissed(){
      setTimeout(()=>{
        this.$destroy()
      },0)
    }
  }
}
</script>

<style scoped>
.annotation_alert {
  position: fixed;
  top: 2%;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>