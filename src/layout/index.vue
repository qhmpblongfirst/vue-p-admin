<template>
  <el-container class="app-wrapper">
    <el-aside width="" class="sidebar-container">
      <sidebar ref="sidebarRef"></sidebar>
    </el-aside>
    <el-container class="main-container">
      <el-header height="60px" class="main-header">
        <div class="nav-container">
          
          <div class="nav-item" v-for="(item, index) in nav" :key="index">
            <Icon :icon="`mdi:${item.icon}`" />
            <span>{{ item.title }}</span>
            <span v-if="index !== nav.length - 1" class="nav-separator"> / </span>
          </div>
          <div style="flex: 1"></div>
          <div class="nav-operation">
            <Icon icon="mdi:refresh" class="operation-item" @click="handleRefresh" />
            <Icon :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" class="operation-item" @click="toggleFullscreen" />
            <Icon icon="mdi:logout" class="operation-item" @click="handleLogout" />
          </div>
        </div>
      </el-header>
      <el-header height="40px" class="main-header">
        <div class="visited-scroll-container">
          <Icon icon="mdi:arrow-left" class="scroll-left" @click="scrollToLeft" v-if="overflowWidth > 0" />
          <div class="visited-container" ref="visitedContainerRef" :class="{ overflow: overflowWidth > 0 }">
            <div class="visited-item" v-for="(item, index) in visitedViews" :key="index" :class="{ active: item.path === activePath }" @click="handleVisitedClick(item)" @contextmenu.prevent="showContextMenu($event, item)">
              <Icon :icon="`mdi:${item.meta.icon}`" class="visited-icon" />
              <el-tooltip :content="item.meta.title" placement="top" effect="dark">
                <span class="visited-title">{{ item.meta.title.split('-')[1]??item.meta.title.split('-')[0] }}</span>
              </el-tooltip>
              
              <Icon icon="mdi:close" v-if="!item.meta.fixed" class="visited-close" @click.native.stop="handleVisitedClose(item)" />
            </div>
          </div>
          <Icon icon="mdi:arrow-right" class="scroll-right" @click="scrollToRight" v-if="overflowWidth > 0" />
        </div>
      </el-header>
      <el-main class="app-main">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" v-if="cached" :key="refreshKey" />
          </keep-alive>
          <component :is="Component" v-if="!cached" :key="refreshKey" />
        </router-view>
      </el-main>
    </el-container>
  </el-container>

  <!-- Add custom context menu -->
  <div v-show="contextMenuVisible" :style="contextMenuStyle" class="context-menu">
    <div class="context-menu-item" @click="refreshPage">
      <Icon icon="mdi:refresh" />
      刷新页面
    </div>
    <div class="context-menu-item" @click="closeCurrentPage" v-if="!rightClickItemFixed">
      <Icon icon="mdi:close" />
      关闭当前页面
    </div>
    <div class="context-menu-item" @click="closeOtherPages">
      <Icon icon="mdi:arrow-left-right" />
      关闭其他页面
    </div>
    <div class="context-menu-item" @click="closeAllPages">
      <Icon icon="mdi:close" />
      关闭所有页面
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import sidebar from './Sidebar/Sidebar.vue'
import { Icon } from '@iconify/vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ref } from 'vue'

const store = useStore()
const router = useRouter()
const nav = computed(() => store.state.tagsView.nav)
const cached = computed(() => {
  if (router.currentRoute.value.meta && router.currentRoute.value.meta.cached) {
    return true
  }
  return false
})
const visitedViews = computed(() => store.state.tagsView.visitedViews)
const selectedView = ref({})
const contextMenuVisible = ref(false)
const contextMenuStyle = reactive({
  top: '0px',
  left: '0px'
})
const currentContextMenuItem = ref(null)
const isFullscreen = ref(false)
const refreshKey = ref(0)
const activePath = ref('')
const visitedContainerRef = ref(null)
const overflowWidth = ref(0)
const sidebarRef = ref(null)
const isPanelCollapse = ref(false)

watch(
  router.currentRoute,
  (newVal) => {
    store.dispatch('tagsView/addVisitedView', {
      path: newVal.path,
      meta: newVal.meta,
      query: newVal.query
    })
    activePath.value = router.currentRoute.value.fullPath
  },
  { deep: true }
)

// 删除分散的 onMounted 钩子，合并成一个
onMounted(() => {
  if (visitedContainerRef.value) {
    resizeObserver = new ResizeObserver(calculateOverflowWidth)
    resizeObserver.observe(visitedContainerRef.value)
  }
  // 检查token和添加访问视图
  store.dispatch('tagsView/addVisitedView', {
    path: router.currentRoute.value.path,
    meta: router.currentRoute.value.meta,
    query: router.currentRoute.value.query
  })
  activePath.value = router.currentRoute.value.fullPath
  rightClickItem.value = store.state.tagsView.visitedViews.find((v) => v.path === activePath.value)

  // 添加关闭上下文菜单的事件监听
  document.addEventListener('click', closeContextMenu)

  // 设置 ResizeObserver
  if (visitedContainerRef.value) {
    resizeObserver = new ResizeObserver(calculateOverflowWidth)
    resizeObserver.observe(visitedContainerRef.value)
  }
})

const handleVisitedClick = (item) => {
  router.push(item.path)
}
const handleVisitedClose = (item) => {
  // console.log(item.path)
  const index = visitedViews.value.findIndex((v) => v.path === item.path)
  if (index > -1) {
    if (index > 0) {
      router.push(visitedViews.value[index - 1].path)
    } else {
      router.push('/')
    }
    store.dispatch('tagsView/delVisitedView', item.path)
  }
}
const handleRefresh = () => {
  NProgress.start()
  refreshKey.value += 1
  nextTick(() => {
    NProgress.done()
  })
}
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}
const handleLogout = () => {
  store.dispatch('user/logout')
  window.location.replace('/')
}
const rightClickItemFixed = ref(false)
const rightClickItem = ref(store.state.tagsView.visitedViews[0])
const showContextMenu = (event, item) => {
  rightClickItem.value = item
  rightClickItemFixed.value = item.meta.fixed
  event.preventDefault()
  contextMenuVisible.value = true
  contextMenuStyle.top = `${event.clientY}px`
  contextMenuStyle.left = `${event.clientX}px`
  currentContextMenuItem.value = item
}

const closeContextMenu = () => {
  contextMenuVisible.value = false
}

const refreshPage = () => {
  // Implement refresh logic
  if (currentContextMenuItem.value) {
    NProgress.start()
    refreshKey.value += 1
    nextTick(() => {
      NProgress.done()
    })
  }
  closeContextMenu()
}

const closeCurrentPage = () => {
  if (currentContextMenuItem.value) {
    handleVisitedClose(currentContextMenuItem.value)
  }
  closeContextMenu()
}

const closeOtherPages = () => {
  // Implement close other pages logic
  store.dispatch('tagsView/delOtherViews', rightClickItem.value)
  const _visitedViews = store.state.tagsView.visitedViews
  const currentPath = router.currentRoute.value.fullPath
  if (_visitedViews.findIndex((p) => p.path == currentPath) == -1) {
    router.push(_visitedViews[_visitedViews.length - 1].path)
  }
  closeContextMenu()
}

const closeAllPages = () => {
  // Implement close all pages logic
  store.dispatch('tagsView/delAllViews')
  const fixedViews = store.state.tagsView.visitedViews.filter((p) => p.meta.fixed)
  if (fixedViews.length == 0) {
    router.push('/')
  } else {
    const currentPath = router.currentRoute.value.fullPath
    if (fixedViews.findIndex((p) => p.path == currentPath) == -1) {
      router.push(fixedViews[0].path)
    }
  }

  closeContextMenu()
}

// 监听 visitedViews 的长度变化
watch(
  () => store.state.tagsView.visitedViews.length,
  (newLength, oldLength) => {
    nextTick(() => {
      calculateOverflowWidth()
    })
  }
)

const calculateOverflowWidth = () => {
  if (visitedContainerRef.value) {
    const container = visitedContainerRef.value
    const containerWidth = container.offsetWidth
    const scrollWidth = container.scrollWidth
    overflowWidth.value = Math.max(0, scrollWidth - containerWidth)

    if (overflowWidth.value > 0) {
      // 滚动到最右侧
      visitedContainerRef.value.scrollLeft = overflowWidth.value
    }
  }
}
let resizeObserver
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// 监听路由变化
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    nextTick(() => {
      scrollToActiveItem()
    })
  }
)

const scrollToActiveItem = () => {
  if (visitedContainerRef.value) {
    const container = visitedContainerRef.value
    const activeItem = container.querySelector('.visited-item.active')

    if (activeItem) {
      const containerRect = container.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()

      if (itemRect.left < containerRect.left) {
        // 如果激活项在可视区域左侧，滚动使其可见
        container.scrollLeft += itemRect.left - containerRect.left - 10 // 10px 的缓冲区
      } else if (itemRect.right > containerRect.right) {
        // 如果激活项在可视区域右侧，滚动使其可见
        container.scrollLeft += itemRect.right - containerRect.right + 10 // 10px 的缓冲区
      }
    }
  }
}

const scrollToLeft = () => {
  if (visitedContainerRef.value) {
    visitedContainerRef.value.scrollLeft = 0
  }
}

const scrollToRight = () => {
  if (visitedContainerRef.value) {
    visitedContainerRef.value.scrollLeft = visitedContainerRef.value.scrollWidth - visitedContainerRef.value.clientWidth
  }
}

const toggleSidePanel = () => {
  isPanelCollapse.value = !isPanelCollapse.value
  // 调用sidebar组件的方法
  sidebarRef.value?.togglePanel(isPanelCollapse.value)
}
</script>

<style lang="scss" scoped>
$header-bg: #ffffff;
$main-bg: #f5f7fa;
$footer-bg: #e4e7ed;
$border-color: #e0e0e0;
$text-color: #2c3e50;
$active-color: #0966f2;

.app-wrapper {
  height: 100vh;
}

.sidebar-container {
  // background-color: #2c3e50;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  width: auto !important;
  background-color: transparent;
}

.main-container {
  background-color: $main-bg;
}

.main-header {
  background-color: $header-bg;
  border-bottom: 1px solid $border-color;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: $text-color;

  .nav-container {
    display: flex;
    align-items: center;
    height: 100%;
    flex: 1;

    .nav-item {
      display: flex;

      .nav-separator {
        margin: 0 8px;
      }
      .iconify {
        font-size: 18px;
        // margin-right: 8px;
      }

      span {
        font-size: 14px;
        font-weight: 500;
      }
    }
    .operation-item {
      font-size: 18px;
      cursor: pointer;
      &:hover {
        color: $active-color;
      }
    }
    .collapse-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin-right: 16px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s;
      
      &:hover {
        background-color: #f5f7fa;
        
        .iconify {
          color: var(--el-color-primary);
        }
      }
      
      .iconify {
        font-size: 20px;
        color: #606266;
        transition: all 0.3s;
      }
    }
  }
  .visited-scroll-container {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    .scroll-left,
    .scroll-right {
      cursor: pointer;
      padding: 5px;
      // 添加一些样式使其看起来像按钮
      // 例如：
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin: 0 10px;
      &:hover {
        background-color: #e0e0e0;
      }
    }
    .visited-container {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 10px;
      overflow: hidden;
      &.overflow {
        border-left: 1px solid $border-color;
        border-right: 1px solid $border-color;
      }
      .visited-item {
        font-size: 13px;
        font-weight: 500;
        
        border: 1px solid $border-color;
        padding: 0 12px;
        border-radius: 4px;
        background-color: #ffffff;
        cursor: pointer;
        display: inline-flex;
        margin-right: 10px;
        align-items: center;
        white-space: nowrap;
        height: 28px; // Slightly reduced height
        transition: all 0.3s ease; // Smooth transition for hover effects
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); // Subtle shadow

        &:hover {
          color: $active-color;
          background-color: #f0f7ff;
        }

        &.active {
          color: #ffffff;
          background-color: $active-color;
          border-color: $active-color;
        }

        .visited-title {
          overflow: hidden;
          white-space: nowrap;
          max-width: 90px;
          text-align: center;
        }
        .visited-icon {
          font-size: 16px; // Slightly smaller icon
          margin-right: 6px;
        }

        .visited-close {
          font-size: 14px;
          margin-left: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          opacity: 0.6; // Start with lower opacity
          transition: all 0.2s ease;

          &:hover {
            color: #fff;
            background-color: rgba(246, 95, 95, 0.9);
            border-radius: 50%;
            opacity: 1;
          }
        }
      }
    }
  }
}

.app-main {
  padding: 20px;
  overflow-y: auto;
}

.main-footer {
  background-color: $footer-bg;
  color: $text-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.nav-operation {
  display: flex;
  align-items: center;

  .operation-item {
    font-size: 18px;
    cursor: pointer;
    margin-left: 15px;

    &:hover {
      color: $active-color;
    }
  }
}

.context-menu {
  position: fixed;
  background: white;
  border: none;
  border-radius: 8px;
  padding: 8px 0;
  min-width: 180px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  transition: opacity 0.2s, transform 0.2s;
  opacity: 0.98;
  transform: scale(0.98);

  &:hover {
    opacity: 1;
    transform: scale(1);
  }
}

.context-menu-item {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #333;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #f0f7ff;
    color: #1890ff;
  }

  .iconify {
    margin-right: 8px;
    font-size: 16px;
  }
}
</style>

