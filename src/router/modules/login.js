const loginRouter = {
  path: '/login',
  component: () => import('@/views/login/index.vue'),
  name: 'login',
  hidden: true,
  meta: {
    title: '登录',
    noCache: true,
  },
}

export default loginRouter
