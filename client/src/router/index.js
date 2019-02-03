import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Modules from '@/components/Modules'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/modules',
      name: 'modules',
      component: Modules
    },
    {
      path: '/modules/create',
      name: 'create',
      component: Modules
    },
    {
      path: '*',
      component: HelloWorld
    }
  ]
})
