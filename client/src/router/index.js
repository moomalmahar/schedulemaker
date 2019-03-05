import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Modules from '@/components/Modules'
import UserModules from '@/components/UserModules'
import Calendar from '@/components/Calendar'

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
      path: '/mymodules',
      name: 'mymodules',
      component: UserModules
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    },
    {
      path: '*',
      component: HelloWorld
    }
  ]
})
