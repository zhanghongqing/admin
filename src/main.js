// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Http from '@/utils/http.js'

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }
  let username = Http.GetCookie('username')
  let password = Http.GetCookie('password')
  if (!username || !password) {
    next('/login')
  } else {
    Http.postQfModel('adminUser', {
      username: username,
      password: password
    }, function (data) {
      if (data.status === 0) {
        next('/login')
      } else if (data.status === 1) {
        next('/login')
      } else if (data.status === 2) {
        console.log(data)
        sessionStorage.setItem('qiangfengo', data.data[0].privilege)
        next(to.fullpath)
      }
    }, function (error) {
      next('/login')
      console.log(error)
    })
  }
})

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
