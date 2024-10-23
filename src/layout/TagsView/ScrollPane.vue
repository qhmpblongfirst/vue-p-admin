<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.native.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script setup>
const tagAndTagSpacing = 4
const left = ref(0)
const scrollContainer = ref(null)
const handleScroll = (e) => {
  const eventDelta = e.wheelDelta || -e.deltaY
  const $container = scrollContainer.value
  $container.scrollLeft = $container.scrollLeft + eventDelta / 4
}
const scrollWrapper = computed(() => {
  return scrollContainer.value.wrapRef
})

const emitScroll = defineEmits(['scroll'])
onMounted(() => {
  scrollWrapper.value.addEventListener('scroll', () => {
    emitScroll('scroll')
  })
})
onBeforeUnmount(() => {
  scrollWrapper.value.removeEventListener('scroll', () => {
    emitScroll('scroll')
  })
})

</script>

<style lang="scss" scoped></style>
