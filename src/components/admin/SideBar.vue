<template>
  <div>
    <nav id="nav" class="navbar-dark bg-dark">
      <a class="navbar-brand mt-3 mb-3">文本标注系统</a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" :to="{name:'admin_project'}">
            <i class="fa fa-folder col-3" aria-hidden="true"></i>
            <span >项目管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name:'admin_users'}">
            <i class="fa fa-user col-3" aria-hidden="true"></i>
            <span >成员概览</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name:'admin_tag_manager'}">
            <i class="fa fa-tag col-3" aria-hidden="true"></i>
            <span >标签管理</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>

</template>

<script>
import 'font-awesome/css/font-awesome.min.css'

export default {
  name: "SideBar",
  mounted() {
    let nav = $("#nav")
    onscroll = function (e){
      scrollY >0 ? nav.css('height', '100%'): nav.css('height', '100vh')
    }
  }
}
</script>

<style scoped>
#nav {
  width: 200px;
  padding-left: 20px;
  height: 100vh;
}
#nav a{
  transition: color 300ms ease-in-out;
}
#nav a.router-link-active {
  color: white;
}
</style>