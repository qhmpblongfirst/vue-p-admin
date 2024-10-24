import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import loginRouter from './modules/login'
import dashboardRouter from './modules/dashboard'
import planRouter from './modules/plan'

export const constantRoutes = [
  loginRouter,
  dashboardRouter,
  planRouter,
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ y: 0 }),
})

export default router
