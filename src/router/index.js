import layout from '@/layout/index.vue'
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'

// 自动导入路由模块
const modules = import.meta.glob('./modules/*.js', { eager: true })
export const constantRoutes = [
  {
    path: '/redirect',
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', noCache: true },
    hidden: true
  },
  {
    path: '/',
    component: layout,
    redirect: '/dashboard',
    meta: {
      title: '首页',
      icon: 'home'
    },
    name: 'home',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '看板',
          icon: 'home',
          fixed: true
        }
      },
      {
        path: '/403',
        component: () => import('@/views/error-page/no-permission.vue'),
        hidden: true,
        meta: {
          title: '403',
          icon: 'airplane-alert'
        }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        hidden: true,
        meta: {
          title: '404',
          icon: 'airplane-alert'
        }
      }
    ]
  }
]
export const asyncRoutes = Object.values(modules).map((module) => module.default)
export const allRoutes = [
  ...constantRoutes,
  ...Object.values(modules).map((module) => module.default),
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ y: 0 }),
})

export default router
