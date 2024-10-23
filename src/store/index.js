import { createStore } from 'vuex'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

// 动态导入 modules 文件夹下的所有模块
const modulesFiles = import.meta.glob('./modules/*.js', { eager: true })
const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
    const moduleName = modulePath.split('/').pop().replace('.js', '')
    const module = modulesFiles[modulePath].default

    if (!module) {
        console.error(`Module ${moduleName} is undefined`)
    } else {
        modules[moduleName] = module
    }

    return modules
}, {})

const store = createStore({
    getters,
    modules,
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
})

export default store
