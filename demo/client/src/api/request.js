import axios from 'axios'
import { Toast } from 'antd-mobile'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('huidu_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (res) => {
    if (res.data.code !== 200) {
      Toast.show({ content: res.data.message || '请求失败', position: 'bottom' })
      return Promise.reject(res.data)
    }
    return res.data
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('huidu_token')
      window.location.href = import.meta.env.BASE_URL + 'login'
    } else {
      Toast.show({ content: err.message || '网络错误', position: 'bottom' })
    }
    return Promise.reject(err)
  }
)

export default request
