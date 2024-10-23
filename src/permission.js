import router from '@/router'
import store from '@/store'
import { getToken, setToken } from '@/utils/token'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import * as settings from '@/settings'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = `${to.meta.title}-${settings.title}`
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果当前路径是登录页，则重定向到首页
      next({ path: '/', replace: true })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next({ path: '/login', replace: true })
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
