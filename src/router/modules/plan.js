import layout from '@/layout/index.vue'

const planRouter = {
  path: '/plan',
  component: layout,
  redirect: '/plan/my-plan-list',
  meta: {
    title: '方案管理',
    icon: 'settings',
  },
  children: [
    {
      path: 'my-plan-list',
      name: 'my-plan-list',
      component: () => import('@/views/plan/my-plan-list.vue'),
      meta: {
        title: '我的计划',
        icon: 'home',
        cached: true,
      },
      query: {
        // cached: true,
      },
    },
    {
      path: 'publish-plan',
      name: 'publish-plan',
      component: () => import('@/views/plan/publish-plan.vue'),
      meta: {
        title: '发布计划',
        icon: 'settings',
      },
    }
  ],
}

export default planRouter
