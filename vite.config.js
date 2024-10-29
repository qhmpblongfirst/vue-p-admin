import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconifyIconResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // 使用现代的 SCSS 编译器
      }
    }
  },
  plugins: [
    vue({ defineModel: true }),
    AutoImport({
      imports: ['vue', 'vue-router', 'vuex'],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconifyIconResolver()]
    }),
    Icons({
      autoInstall: true,
      scale: 1,
      defaultClass: 'inline-block',
      compiler: 'vue3'
    })
  ],
  resolve: {
    alias: {
      '@': '/src' // 添加别名配置
    }
  }
})
