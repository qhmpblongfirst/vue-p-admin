<script setup>
// 这里可以添加任何需要的逻辑
</script>

<template>
  <router-view></router-view>
</template>

<style>
html, body {
  height: 100%; /* 确保 html 和 body 高度为 100% */
  margin: 0; /* 移除默认 margin */
  padding: 0; /* 移除默认 padding */
  overflow: hidden; /* 防止出现滚动条 */
}

#app {
  height: 100%; /* 确保 #app 高度为 100% */
  overflow: hidden; /* 防止出现滚动条 */
}
</style>
