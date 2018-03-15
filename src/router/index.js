import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/pages/Index').default
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/pages/Login').default
    },
    {
      path: '/web/nav',
      name: 'nav',
      component: require('@/pages/web/nav/Show').default
    },
    {
      path: '/web/index/banner',
      name: 'banner',
      component: require('@/pages/web/index/Banner').default
    },
    {
      path: '/web/index/book',
      name: 'book',
      component: require('@/pages/web/index/Book').default
    },
    {
      path: '/web/index/menu',
      name: 'menu',
      component: require('@/pages/web/index/Menu').default
    },
    {
      path: '/web/news',
      name: 'newsShow',
      component: require('@/pages/web/news/Show').default
    },
    {
      path: '/web/news/add',
      name: 'newsAdd',
      component: require('@/pages/web/news/Add').default
    },
    {
      path: '/web/news/update',
      name: 'newsUpdate',
      component: require('@/pages/web/news/Update').default
    },
    {
      path: '/web/down',
      name: 'downShow',
      component: require('@/pages/web/down/Show').default
    },
    {
      path: '/web/down/add',
      name: 'downAdd',
      component: require('@/pages/web/down/Add').default
    },
    {
      path: '/web/down/update',
      name: 'downUpdate',
      component: require('@/pages/web/down/Update').default
    },
    {
      path: '/course',
      name: 'courseShow',
      component: require('@/pages/course/Show').default
    },
    {
      path: '/course/create',
      name: 'courseCreate',
      component: require('@/pages/course/Create').default
    },
    {
      path: '/course/edit',
      name: 'courseEdit',
      component: require('@/pages/course/Edit').default
    },
    {
      path: '/course/update',
      name: 'courseUpdate',
      component: require('@/pages/course/Update').default
    },
    {
      path: '/course/material',
      name: 'courseMaterial',
      component: require('@/pages/course/Material').default
    },
    {
      path: '/course/video',
      name: 'courseVideo',
      component: require('@/pages/course/Video').default
    },
    {
      path: '/course/package',
      name: 'coursePackage',
      component: require('@/pages/course/Package').default
    },
    {
      path: '/course/filter',
      name: 'courseFilter',
      component: require('@/pages/course/Filter').default
    },
    {
      path: '/images/',
      name: 'showimg',
      component: require('@/pages/images/Show').default
    },
    {
      path: '/images/upload',
      name: 'uploadimg',
      component: require('@/pages/images/Upload').default
    },
    {
      path: '/users/',
      name: 'userinfo',
      component: require('@/pages/users/Show').default
    },
    {
      path: '/users/info',
      name: 'userinfos',
      component: require('@/pages/users/Info').default
    },
    {
      path: '/users/search',
      name: 'usersearch',
      component: require('@/pages/users/Search').default
    },
    {
      path: '/users/student',
      name: 'userinfoa',
      component: require('@/pages/users/Student').default
    },
    {
      path: '/order/',
      name: 'order',
      component: require('@/pages/order/Show').default
    },
    {
      path: '/order/course',
      name: 'orderInfo',
      component: require('@/pages/order/Info').default
    },
    {
      path: '/order/list',
      name: 'orderList',
      component: require('@/pages/order/List').default
    },
    {
      path: '/order/filter',
      name: 'orderFilter',
      component: require('@/pages/order/Filter').default
    }
  ]
})
