import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import Home from '../views/Home.vue'
import {request} from '@/network/request'
import Project from "../components/Home/Project";


Vue.use(VueRouter)
Vue.use(VueCookies)



const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        redirect: '/index',
      },
      {
        path: '/index',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../components/Home/Home'),
        meta:{
          title:'文本标注系统-标注项目汇总'
        },
      },
      {
        path: '/project',
        component: Project,
        children: [
          {
            path: '',
            name: 'project_edit',
            component: () => import(/* webpackChunkName: "project_edit" */ '../components/Home/ProjectEdit'),
            meta:{
              title:'文本标注系统-标注页面'
            },
          },
        ]
      },
    ]
  },
  {
    path: '/admin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    children: [
      {
        path: '/admin/index',
        name: 'admin_project',
        component: () => import(/* webpackChunkName: 'admin_home' */ '../components/admin/Project.vue' ),
        meta:{
          title:'标注管理-首页'
        },
      },
      {
        path: '/admin/create_project',
        name: 'admin_create_project',
        component: () => import(/* webpackChunkName: 'admin_home' */ '../components/admin/CreateProject.vue' ),
        meta:{
          title:'标注管理-创建项目'
        },
      },
      {
        path: '/admin/users',
        name: 'admin_users',
        component: () => import(/* webpackChunkName: 'admin_home' */ '../components/admin/ProjectUsers.vue' ),
        meta:{
          title:'标注管理-用户界面'
        },
      },
      {
        path: '/admin/tags',
        name: 'admin_tag_manager',
        component: () => import(/* webpackChunkName: 'admin_home' */ '../components/admin/TagManager.vue' ),
        meta:{
          title:'标注管理-标签设置'
        },
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta:{
      title:'文本标注系统-登录'
    },
  },
  {
    path: '*',
    name:'Page404',
    component: () => import(/* webpackChunkName: "Page404" */ '../views/Page404.vue'),
    meta:{
      title:'文本标注系统-404'
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    window.document.title = to.meta.title
  }
  if(!Vue.$cookies.get('sessionid') && to.name !== 'Login'){
     next({
       name:'Login',
     })
  }
  if(!Vue.$cookies.get('csrftoken')){
    request({
      config: {
        method: 'post',
        url: '/api/user/get_token/',
      }
    })
  }
  next()
})
export default router
