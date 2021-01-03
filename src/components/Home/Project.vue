<template>
  <div>
    <side-bar></side-bar>
    <router-view/>
  </div>
</template>

<script>

import SideBar from "./NavBar";

export default {
  name: "Project",
  components:{
    SideBar
  }
}
</script>

<style scoped>

</style>