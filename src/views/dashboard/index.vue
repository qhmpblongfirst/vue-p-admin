<template>
  <div>
    <!-- <Icon icon="mdi:home" /> -->
  </div>
</template>

<script setup>
// import { Icon } from '@iconify/vue'
import { title } from '@/settings'
const router = useRouter()
document.title = `${router.currentRoute.value.meta.title}-${title}`
// console.log(process.env.NODE_ENV)
</script>

<style lang="scss" scoped></style>
