import axios from 'axios'
import store from 'store'

const instance = axios.create({
  // baseURL: 'http://192.168.0.31:18080'
  baseURL: 'http://192.168.0.132:8080'
})

instance.interceptors.request.use(function (config) {
  if (store.state.auth.token !== null) {
    // config['headers'] = {
    config.headers = {
      Authorization: `Bearer ${store.state.auth.token}`
    }
  }

  return config
})

export default instance
