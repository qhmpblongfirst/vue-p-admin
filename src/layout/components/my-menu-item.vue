<template>
  <el-menu-item :index="path" v-if="item" @click="handleClick">
    <i
      :class="icon"
      class="icon-class-custom"
      v-if="icon.indexOf('el-icon') > -1"
    />
    <Icon
      :icon="`mdi:${icon}`"
      class="icon-class-custom"
      v-if="icon.indexOf('el-icon') == -1"
    />
    {{ item.meta.title }}
  </el-menu-item>
  <Icon :icon="`mdi:${icon}`" class="icon-class-custom" v-else />
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
  icon: {
    type: String,
    default: '',
  },
  path: {
    type: String,
    default: '',
  },
})
const handleClick = () => {
  router.push(props.path)
  document.title=`${props.item.meta.title}-管理后台`
}
</script>

<style lang="scss" scoped>

</style>
