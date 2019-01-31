import Vue from 'vue'
import Router from 'vue-router'
import Modules from '@/components/Modules'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: Modules
    }

  ]
})
