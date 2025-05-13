<template>
  <div class="sidebar-container" :class="{ expanded: !onlyOneChild }">
    <div class="parent-container">
      <div class="parent-menu" v-for="(parentMenu, index) in filteredRoutes" :key="index" @click="handleParentMenuClick(parentMenu)" :class="{ active: currentParent.path === parentMenu.path }">
        <Icon :icon="`mdi:${parentMenu.meta.icon}`" class="menu-icon" />
        <span class="menu-title">
          {{ parentMenu.children && parentMenu.children.length == 1 ? parentMenu.children[0].meta.title : parentMenu.meta.title }}
        </span>
      </div>
    </div>
    <div class="children-panel-container" v-if="!onlyOneChild && panelShow">
      <div class="children-title">{{ settings.title }}</div>
      <router-link class="child-menu" v-for="(childMenu, index) in filteredChildren" :key="index" :to="childMenu.path" :class="{ active: router.currentRoute.value.name === childMenu.name }" @click.prevent="handleChildMenuClick(childMenu)">
        <Icon :icon="`mdi:${childMenu.meta.icon}`" class="menu-icon" />
        <span class="menu-title">{{ childMenu.meta.title }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import * as settings from '@/settings'
const panelShow = defineModel('panelShow')
const router = useRouter()
const route = useRoute()
const store = useStore()
const permissionRoutes = computed(() => store.state.permission.routes)
const filteredRoutes = ref([])
const isPanelCollapse = ref(false)

const currentParent = ref(null)
const filteredChildren = computed(() => {
  return currentParent.value.children?.filter((menu) => !menu.hidden) || []
})
const onlyOneChild = ref(false)
const handleParentMenuClick = (parentMenu) => {
  panelShow.value = true
  // 如果只有一个子菜单，直接跳转到子菜单
  if (parentMenu.children && parentMenu.children.length === 1) {
    const child = parentMenu.children[0]
    router.push({ path: `/${parentMenu.path}/${child.path}`.replace(/\/+/g, '/') })
    return
  }

  // 如果父菜单有默认路由，跳转到第一个可见的子菜单
  if (parentMenu.children && parentMenu.children.length > 0) {
    const firstVisibleChild = parentMenu.children.find((child) => !child.hidden)
    if (firstVisibleChild) {
      router.push({ path: `/${parentMenu.path}/${firstVisibleChild.path}`.replace(/\/+/g, '/') })
    }
  } else {
    // 如果没有子菜单，直接跳转到父菜单路径
    router.push({ path: `/${parentMenu.path}`.replace(/\/+/g, '/') })
  }
}
watch(
  () => store.state.permission.routes,
  (newVal) => {
    filteredRoutes.value = newVal.filter((route) => !route.hidden)
    watchRoute(router.currentRoute.value)
  },
  {
    deep: true
  }
)

const handleChildMenuClick = (childMenu) => {
  router.push({ name: childMenu.name })
}
const watchRoute = (newVal) => {
  filteredRoutes.value = permissionRoutes.value.filter((route) => !route.hidden)
  filteredRoutes.value.forEach((r) => {
    const nav = []
    if (r.children.findIndex((p) => p.name == newVal.name) > -1) {
      currentParent.value = r
      nav.push({ icon: r.meta.icon, title: r.meta.title })
      const visibleChildren = r.children.filter((child) => !child.hidden)
      onlyOneChild.value = !r.children || r.children.length === 0 || visibleChildren.length === 1
    }
    if (r.meta.fixed && !r.meta.hidden) {
      store.dispatch('tagsView/addVisitedView', {
        meta: r.meta,
        title: r.meta.title,
        path: `/${r.path}/${c.path}`.replace(/(\/)+/g, '/'),
        query: r.query
      })
    }
    if (r.children) {
      r.children.forEach((c) => {
        if (c.name == newVal.name) {
          nav.push({ icon: c.meta.icon, title: c.meta.title })
        }
        if (c.meta.fixed && !c.meta.hidden) {
          store.dispatch('tagsView/addVisitedView', {
            meta: c.meta,
            title: c.meta.title,
            path: `/${c.path}`.replace(/(\/)+/g, '/'),
            query: c.query
          })
        }
      })
    }
    if (nav.length > 0) {
      store.dispatch('tagsView/setNav', nav)
    }
  })
}

watch(
  () => route,
  (newVal) => {
    watchRoute(newVal)
  },
  { immediate: true, deep: true }
)

const togglePanel = (collapsed) => {
  // 根据传入的 collapsed 状态更新侧边栏
  isPanelCollapse.value = collapsed
  panelShow.value = !collapsed  // 同时更新 panelShow 的状态
}

// 将方法暴露给父组件
defineExpose({
  togglePanel
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
$parent-menu-width: 60px;
$parent-menu-margin: 7.5px;
$parent-menu-container-width: $parent-menu-width + $parent-menu-margin + $parent-menu-margin;
$children-panel-width: 200px;
$parent-menu-active-color: $primary-color;
$interval: 1.3s;
$soft-border: 1px solid #e0e0e0;
@keyframes expandSidebar {
  from {
    width: $parent-menu-container-width;
  }
  to {
    width: $parent-menu-container-width + $children-panel-width;
  }
}
.sidebar-container {
  display: flex;
  color: #fff;
  height: 100%;
  width: $parent-menu-container-width;
  overflow: hidden;
  box-sizing: border-box;
  border-right: $soft-border;
  transition: width $interval ease-in-out;

  &.expanded {
    // width: $parent-menu-container-width + $children-panel-width;
    animation: expandSidebar $interval ease-in-out forwards;
  }

  .parent-container {
    width: $parent-menu-container-width;
    display: flex;
    background-color: #fff;
    flex-direction: column;
    .parent-menu {
      text-decoration: none;
      color: $primary-color;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: column;
      height: $parent-menu-width;
      cursor: pointer;
      width: $parent-menu-width;
      margin: $parent-menu-margin;
      border-radius: 4px;
      &.active {
        background-color: $primary-color;
        color: #fff;
      }
      &:hover {
        background-color: $primary-color;
        color: #fff;
      }
      .menu-icon {
        margin-top: 5px;
        font-size: 24px;
      }
      .menu-title {
        font-size: 12px;
      }
    }
  }
  .children-panel-container {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    width: $children-panel-width;
    position: relative;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    .children-title {
      font-size: 26px;
      color: #535252;
      padding: 12px 20px;
      box-sizing: border-box;
      height: 60px;
      border-bottom: $soft-border; // Changed border color for a softer look
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }
    .child-menu {
      text-decoration: none;
      display: flex;
      align-items: center;
      padding: 0 20px;
      cursor: pointer;
      height: $parent-menu-width * 0.618;
      margin: $parent-menu-margin;
      border-radius: 4px;
      &:hover {
        background-color: #bdc0c5;
        .menu-title,
        .menu-icon {
          color: #fff;
        }
      }
      &.active {
        background-color: $parent-menu-active-color;
        color: #fff;
        .menu-title,
        .menu-icon {
          color: #fff;
        }
      }
      .menu-icon {
        font-size: 18px;
        margin-right: 10px;
        color: #333;
      }

      .menu-title {
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>
