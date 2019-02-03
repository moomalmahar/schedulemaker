import Api from './Api'

export default {
  index () {
    return Api().get('modules')
  },
  post (module) {
    return Api().post('modules', module)
  },
}
