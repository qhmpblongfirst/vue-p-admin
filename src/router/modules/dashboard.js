import layout from '@/layout/index.vue'

const dashboardRouter = {
  path: '/',
  component: layout,
  redirect: '/dashboard',
  meta: {
    title: '首页1',
    icon: 'settings',
  },
  children: [
    {
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '首页2',
        icon: 'home',
        fixed: true,
      },
    },
  ],
}

export default dashboardRouter
