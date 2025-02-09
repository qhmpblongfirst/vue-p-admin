import router from '@/router'
import store from '@/store'
import { getToken, setToken } from '@/utils/token'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import * as settings from '@/settings'
import { constantRoutes } from './router'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login','']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = `${to.meta.title}-${settings.title}`
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/', replace: true })
      NProgress.done()
    } else {
      const asyncRoutes = store.state.permission.routes
      if (asyncRoutes.length === 0) {
        await store.dispatch('permission/reloadRoutesAsync')
      }
      
      let hasPermission = constantRoutes.some(r => {
        return r.name === to.name || (r.children && r.children.some(c => c.name === to.name))
      })
      
      hasPermission = hasPermission || store.state.permission.routes.some(r => {
        return r.name === to.name || (r.children && r.children.some(c => c.name === to.name))
      })

      if (!hasPermission) {
        next({ path: '/403', replace: true })
        NProgress.done()
      } else {
        next()
      }
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
