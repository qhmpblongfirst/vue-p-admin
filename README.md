# Vue 3 + Javascript + Vite + Element-plus

**一个后端程序员撸的**

实现了vue element admin的基本操作，没有使用动态路由，因为需要权限控制的一个项目通过vue element admin完成，这个就不想写了

需要添加动态路由的可以在/src/permission.js的路由守卫中自行实现

相比vue element admin，增加了vuex-persistedstate来持久化打开的页面，当打开多个页面时，按F5刷新，打开的标签页不会像element element admin一样只保留当前页

没有什么主题、配色之类，想到哪写到哪，**不支持**多端自适应


**真·框架**

**不了解这开源协议那开源协议，纯纯为了自己方便，后端同学看得上就拿去用**

免费！免费！免费！重要的事情说三遍

食用方法：

- 页面放在/src/views下
- 路由在/src/router，模块化处理，./modules下的js文件没有自动引入index.js
- 状态管理在/src/store，模块化处理，模块自动引入，需要修改直接在./modules目录下照猫画虎即可
- 项目中所使用到的icon均来自iconify的开源
- /utils/http.js内包含POST、GET、JSONP的方法，请求前会判断JWT是否存在，自动添加
- 开发环境和生产环境请求baseURL在/src/setting.js内设置

预览地址：[https://vue-p-admin.dulili.net](https://vue-p-admin.dulili.net)
