import Api from './Api'

export default {
  post () {
    return Api().post('parser')
  }
}
