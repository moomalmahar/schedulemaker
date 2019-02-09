import Api from './Api'

export default {
  index () {
    return Api().get('mymodules')
  },
  post (module) {
    return Api().post('modules', module)
  },
  delete (ModuleId) {
    return Api().delete(`modules/${ModuleId}`)
  }
}
