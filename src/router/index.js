import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'

// 自动导入路由模块
const modules = import.meta.glob('./modules/*.js', { eager: true })

// 处理路由模块
export const constantRoutes = Object.values(modules).map(module => module.default)

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ y: 0 }),
})

export default router
