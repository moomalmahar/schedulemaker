import Api from './Api'

export default {
  post (journey) {
    return Api().post('journey', journey)
  }
}
