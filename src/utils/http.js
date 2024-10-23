import axios from 'axios'
import { getToken } from './token'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as settings from '@/settings'
import store from '../store'

function showMessage(message, type = 'success', duration = 3000) {
  ElMessage({
    message,
    type,
    duration,
    grouping: true,
    showClose: true,
  })
}

let baseURL = settings.baseURL // 默认值
let service // 声明 axios 实例
let isServiceInitialized = false // 标记服务是否已初始化
// 在生产环境中从服务器获取 config.js
const initializeService = () => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production') {
      fetch('/config.js')
        .then((response) => response.json())
        .then((config) => {
          baseURL = config.baseURL // 从 config.js 中获取 baseURL
          createAxiosInstance() // 创建 axios 实例
          isServiceInitialized = true // 标记服务已初始化
          resolve()
        })
        .catch((error) => {
          console.error('Error fetching config.js:', error)
          showMessage('Error fetching config.js', 'error')
          reject(error)
        })
    } else {
      createAxiosInstance() // 在开发环境中直接创建 axios 实例
      isServiceInitialized = true // 标记服务已初始化
      resolve()
    }
  })
}
function createAxiosInstance() {
  service = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
  service.interceptors.request.use(
    (config) => {
      if (store.getters.token) {
        config.headers['Authorization'] = `Bearer ${getToken()}`
      }
      return config
    },
    (error) => {
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  service.interceptors.response.use(
    (response) => {
      const res = response.data
      if (res.return_code == 0) return res
      if (res.return_code != undefined) {
        showMessage(res.return_message, 'error')
        return res
      }
      return res
    },
    (error) => {
      console.log('err' + error) // for debug
      console.error(
        '详细错误信息:',
        error.response ? error.response.data : error
      )
      showMessage(error.message, 'error')
      return Promise.reject(error)
    }
  )
}

export const postAsync = async function (url, data, showMessage = false) {
  console.log(url)
  // 确保 service 已经被初始化
  if (!isServiceInitialized) {
    await initializeService()
  }

  let res = await service.post(url, data)
  if (showMessage && res.return_code == 0) {
    showMessage(`操作成功` || res.return_message, 'success')
  }
  return res
}

export const getAsync = async function (url, showMessage = false) {
  // 确保 service 已经被初始化
  if (!isServiceInitialized) {
    await initializeService()
  }

  let res = await service.get(url)
  if (showMessage && res.return_code == 0) {
    showMessage(res.return_message, '操作成功')
  }
  return res
}

// 在应用启动时初始化服务
initializeService().catch((error) => {
  showMessage('服务初始化失败', 'error')
})

export const jsonp = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    // 创建一个随机的回调函数名
    const callbackName = `jsonp_callback_${Math.random()
      .toString(36)
      .substr(2, 16)}`

    // 将参数转换为查询字符串
    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
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
