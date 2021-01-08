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
        redirect: '/index'
      },
      {
        path: '/index',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../components/Home/Home'),
      },
      {
        path: '/project',
        component: Project,
        children: [
          {
            path: '',
            name: 'project_edit',
            component: () => import(/* webpackChunkName: "project_edit" */ '../components/Home/ProjectEdit'),
          },
          {
            path: '/tag_manage',
            name: 'tag_manage',
            component: () => import(/* webpackChunkName: "tag_manage" */ '../components/Home/TagManage'),
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
        path: '',
        name: 'admin_project',
        component: () => import(/* webpackChunkName: 'admin_home' */ '../components/admin/Project.vue' ),
      },
      {
        path: '/create_project',
        name: 'admin_create_project',
        component: () => import(/* webpackChunkName: 'admin_home' */ '../components/admin/CreateProject.vue' )
      },
      {
        path: '/users',
        name: 'admin_users',
        component: () => import(/* webpackChunkName: 'admin_home' */ '../components/admin/ProjectUsers.vue' )
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '*',
    name:'Page404',
    component: () => import(/* webpackChunkName: "Page404" */ '../views/Page404.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
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
