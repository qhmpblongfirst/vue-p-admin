import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.js'

// 禁用开发者工具的函数
function disableDevTools() {
  // 禁用右键菜单
  document.addEventListener('contextmenu', (e) => e.preventDefault())

  // 禁用 F12 键
  document.onkeydown = function (e) {
    if (e.keyCode === 123) {
      e.preventDefault()
      return false
    }
  }

  // 禁用 Ctrl+Shift+I
  document.onkeydown = function (e) {
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) {
      e.preventDefault()
      return false
    }
  }

  // 简化的开发者工具检测
  setInterval(() => {
    const threshold = 160
    if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
      document.body.innerHTML = '开发者工具已被禁用'
    }
  }, 1000)
}

// 在生产环境中启用禁用开发者工具的功能
if (process.env.NODE_ENV === 'production') {
  //   disableDevTools();//禁用开发者工具
}

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.use(store)
app.mount('#app')
