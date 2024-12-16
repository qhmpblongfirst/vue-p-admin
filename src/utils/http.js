import axios from 'axios'
import { getToken } from './token'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as settings from '@/settings'
import store from '../store'
import router from '../router'

function showMessage(message, type = 'success', duration = 3000) {
  ElMessage({
    message,
    type,
    duration,
    grouping: true,
    showClose: true
  })
}

let baseURL = settings.baseURL // 默认值
if (process.env.NODE_ENV === 'production') {
  baseURL = settings.productionBaseURL
}

const service = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  method: 'post',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  validateStatus: function (status) {
    return true
  }
})
service.interceptors.request.use(
  (config) => {
    const token = `${getToken()}`
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.return_code == 0) return res
    if (res.return_code == 401) {
      store.dispatch('user/logout')
      router.replace('/login')
      return Promise.reject(('登录已过期'))
    }
    if (res.return_code != undefined) {
      showMessage(res.return_message, 'error')
      return res
    }
    return res
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const postAsync = async function (url, data, showMessage2 = false) {
  // try{
  //   const response = await fetch(`${baseURL}${url}`, {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //     headers: {
  //       'Content-Type': 'application/json;charset=utf-8',
  //       'Authorization': `Bearer ${getToken()}1`
  //     }
  //   })
  //   console.log(response.status)
  //   return await response.json()
  // } catch (error) {
  //   // showMessage(error.message, 'error')
  //   return {}
  //   return Promise.reject(error)
  // }

  const res = await service.post(url, data)
  if (showMessage2 && res.return_code == 0) {
    showMessage(`操作成功` || res.return_message, 'success')
  }
  return res
}

export const getAsync = async function (url, showMessage = false) {
  const res = await service.get(url)
  if (showMessage && res.return_code == 0) {
    showMessage(res.return_message, '操作成功')
  }
  return res
}

export const jsonp = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    // 创建一个随机的回调函数名
    const callbackName = `jsonp_callback_${Math.random().toString(36).substr(2, 16)}`

    // 将参数转换为查询字符串
    const queryString = Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')

    // 创建 script 标签
    const script = document.createElement('script')
    script.src = `${url}?${queryString}&callback=${callbackName}`

    // 处理成功和失败的回调
    window[callbackName] = (data) => {
      resolve(data)
      delete window[callbackName] // 清理回调函数
      document.body.removeChild(script) // 移除 script 标签
    }

    script.onerror = () => {
      reject(new Error('JSONP request failed'))
      delete window[callbackName] // 清理回调函数
      document.body.removeChild(script) // 移除 script 标签
    }

    document.body.appendChild(script) // 添加 script 标签到文档
  })
}
