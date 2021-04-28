<template>
  <div>
    <nav-bar></nav-bar>
    <router-view/>
  </div>
</template>

<script>

import NavBar from "./NavBar";

export default {
  name: "Project",
  components:{
    NavBar
  }
}
</script>

<style scoped>

</style>