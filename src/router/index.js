import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import Home from '../views/Home.vue'
import {request} from '@/network/request'


Vue.use(VueRouter)
Vue.use(VueCookies)



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    children: [
      {
        path:'',
        name: 'Admin',
        redirect: {name: 'admin_project'}
      },
      {
        path: 'project',
        name: 'admin_project',
        component: () => import(/* webpackChunkName: 'admin_home' */ '../components/project/Project.vue' ),
        children: [

        ]
      },
      {
        path: 'create_project',
        name: 'admin_create_project',
        component: () => import(/* webpackChunkName: 'admin_home' */ '../components/project/CreateProject.vue' )
      },
      {
        path: 'users',
        name: 'admin_users',
        component: () => import(/* webpackChunkName: 'admin_home' */ '../components/Users.vue' )
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(!Vue.$cookies.get('sessionid') && to.name !=='Login'){
     next({name:'Login'})
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
