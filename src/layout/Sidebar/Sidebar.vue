<template>
  <div class="sidebar-container" :class="{ expanded: !onlyOneChild }">
    <div class="parent-container">
      <div class="parent-menu" v-for="(parentMenu, index) in filteredRoutes" :key="index" @click="handleParentClick(parentMenu)" :class="{ active: currentParent.path === parentMenu.path }">
        <Icon :icon="`mdi:${parentMenu.meta.icon}`" class="menu-icon" />
        <span class="menu-title">
          {{ parentMenu.children && parentMenu.children.length == 1 ? parentMenu.children[0].meta.title : parentMenu.meta.title }}
        </span>
      </div>
    </div>
    <div class="children-panel-container" v-if="!onlyOneChild">
      <div class="children-title">{{ settings.title }}</div>
      <div class="child-menu" v-for="(childMenu, index) in filteredChildren" :key="index" @click="handleChildrenClick(childMenu)" :class="{ active: router.currentRoute.value.path === getFullPath(currentParent, childMenu) }">
        <Icon :icon="`mdi:${childMenu.meta.icon}`" class="menu-icon" />
        <span class="menu-title">{{ childMenu.meta.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { constantRoutes } from '@/router/index.js'
import * as settings from '@/settings'

const router = useRouter()
const store = useStore()
const showChildrenPanel = defineModel('visible')

const filteredRoutes = constantRoutes.filter((route) => !route.hidden)


const currentParent = ref(filteredRoutes[0])
const filteredChildren = computed(() => {
  return currentParent.value.children?.filter(menu => !menu.hidden) || []
})
watch(
  currentParent,
  (newVal) => {
    showChildrenPanel.value = newVal.children && newVal.children.length > 1
  },
  { deep: true, immediate: true }
)
watch(
  router.currentRoute,
  (newVal) => {
    currentParent.value = filteredRoutes.find((r) => r.children.findIndex((p) => getFullPath(r, p) == newVal.path) > -1)
    generateNav()
  },
  { deep: true }
)
const generateNav = () => {
  let arr = []
  if (currentParent.value.children && currentParent.value.children.length > 1) {
    arr.push({
      icon: currentParent.value.meta.icon,
      title: currentParent.value.meta.title
    })
    arr.push({
      icon: router.currentRoute.value.meta.icon,
      title: router.currentRoute.value.meta.title
    })
  } else {
    arr.push({
      icon: currentParent.value.meta.icon,
      title: router.currentRoute.value.meta.title
    })
  }
  store.dispatch('tagsView/setNav', arr)
}
const onlyOneChild = computed(() => {
  if (currentParent.value.children && currentParent.value.children.length > 1) return false
  return true
})
const getFullPath = (parentMenu, childrenMenu) => {
  return `/${parentMenu.path}/${childrenMenu.path}`.replace(/(\/)+/g, '/')
}
onMounted(() => {
  currentParent.value = filteredRoutes.find((r) => r.children.findIndex((p) => getFullPath(r, p) == router.currentRoute.value.path) > -1)
  generateNav()
  filteredRoutes.forEach((route) => {
    if (route.meta.fixed && !route.meta.hidden) {
      store.dispatch('tagsView/addVisitedView', {
        meta: route.meta,
        title: route.meta.title,
        path: `/${route.path}`.replace(/(\/)+/g, '/'),
        query: route.query
      })
    }
    if (route.children && route.children.length > 0) {
      route.children.forEach((child) => {
        if (child.meta.fixed && !child.meta.hidden) {
          store.dispatch('tagsView/addVisitedView', {
            meta: child.meta,
            title: child.meta.title,
            path: getFullPath(route, child),
            query: child.query
          })
        }
      })
    }
  })
})
const handleParentClick = (parentMenu) => {
  currentParent.value = parentMenu
  router.push(parentMenu.path)
}
const handleChildrenClick = (childrenMenu) => {
  router.push(childrenMenu.path)
}
</script>

<style lang="scss" scoped>
$parent-menu-width: 60px;
$parent-menu-margin: 7.5px;
$parent-menu-container-width: $parent-menu-width + $parent-menu-margin + $parent-menu-margin;
$children-panel-width: 200px;
$parent-menu-active-color: #0966f2;
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
    background-color: #151d25;
    flex-direction: column;
    .parent-menu {
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
        background-color: $parent-menu-active-color;
        color: #fff;
      }
      &:hover {
        background-color: $parent-menu-active-color;
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
