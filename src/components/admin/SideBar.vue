<template>
  <nav id="nav" class=" navbar-dark bg-dark flex-column">
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
<!--      <li class="nav-item">-->
<!--        <a class="nav-link" href="#collapseMenu" aria-controls="collapseMenu" role="button" data-toggle="collapse"-->
<!--           aria-expanded="false">-->
<!--          Dropdown link-->
<!--        </a>-->
<!--        <div id="collapseMenu" class="collapse">-->
<!--          <ul class="navbar-nav ml-3">-->
<!--            <li class="nav-item">-->
<!--              <a class="nav-link" href="#">Action</a>-->
<!--            </li>-->
<!--            <li class="nav-item">-->
<!--              <a class="nav-link" href="#">Another action</a>-->
<!--            </li>-->
<!--            <li class="nav-item">-->
<!--              <a class="nav-link" href="#">Something else here</a>-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->
<!--      </li>-->
    </ul>
  </nav>
</template>

<script>
import 'font-awesome/css/font-awesome.min.css'

export default {
  name: "SideBar",
  props: {
    cols: {
      default: 'col-2'
    }
  }
}
</script>

<style scoped>
#nav {
  width: 190px;
  padding-left: 20px;
  position:fixed;
  top:0;
  bottom:0;
  height: 100%;
}
#nav a{
  transition: color 300ms ease-in-out;
}
#nav a.router-link-active {
  color: white;
}
</style>