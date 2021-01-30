import axios from 'axios'
import router from '../router'

axios.defaults.withCredentials = true

export function request(option) {
  const instance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 5000
  })
  // 拦截器（请求成功/失败，响应成功/失败）
  instance.interceptors.request.use(cfg => {
    console.log("request_ok ")
    console.log(cfg)
    return cfg
  }, error => {
    console.log("request_error " + error)
  })
  instance.interceptors.response.use(cfg => {
    console.log("response_ok ")
    console.log(cfg.data);
    if (cfg.data['is_authenticated'] !== undefined && !cfg.data['is_authenticated']) {
      router.replace({name: "Login"}).catch(err => {
      })
    }
    return cfg
  }, error => {
    console.log("response_error ")
    console.log(error)
    alert(error)
    return error
  })
  return instance(option.config)
}
