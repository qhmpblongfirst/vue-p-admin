import * as permissionApi from '@/apis/permission'
import { constantRoutes, allRoutes,asyncRoutes } from '@/router'
import router from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (!roles || roles.length === 0) return true
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function filterDbAccessedRoutes(routes, dbRoutes) {
  let tmp = []
  for (let i = 0; i < routes.length; i++) {
    for (let j = 0; j < dbRoutes.length; j++) {
      if (routes[i].name == dbRoutes[j].name) {
        let hhh = routes[i]
        routes[i].sort = dbRoutes[j].sort
        if (routes[i].children) {
          hhh.children = filterDbAccessedRoutes(routes[i].children, dbRoutes[j].children)
          hhh.children.sort((a, b) => a.sort - b.sort)
        }
        tmp.push(hhh)
      }
    }
  }
  tmp.sort((a, b) => a.sort - b.sort)
  return tmp
}

function contain(route, dbRoutes) {
  if (route.path == '*') return true
  if (route.name == 'merchant-list') {
    console.log(dbRoutes.some((p) => p.name == route.name))
  }
  return dbRoutes.some((p) => p.name == route.name || p.children.some((x) => x.name == route.name))
}
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    // state.routes = routes
  }
}

const actions = {
  generateRoutesAsync({ commit }) {
    return new Promise(async (resolve) => {
      let accessedRoutes = filterAsyncRoutes(asyncRoutes, [])
      let datas = JSON.parse(JSON.stringify(accessedRoutes))
      await permissionApi.generateRoutesAsync(datas)
      // let dbRoutes = (await permissionApi.getAccessedRoutesAsync()).data.datas
      // accessedRoutes = filterDbAccessedRoutes(accessedRoutes, dbRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  async saveRoleAsync({ commit }, role) {
    await permissionApi.saveRoleAsync(role)
  },
  async deleteRoleAsync({ commit }, roleId) {
    await permissionApi.deleteRoleAsync(roleId)
  },
  async resumeRoleAsync({ commit }, roleId) {
    await permissionApi.resumeRoleAsync(roleId)
  },
  async getAllApisAsync({ commit }) {
    let apis = await permissionApi.getAllApisAsync()
    return apis
  },
  async getAllRolesAsync({ commit }) {
    let roles = await permissionApi.getAllRolesAsync()
    return roles
  },
  async saveRolePermissionAsync({ commit }, datas) {
    await permissionApi.saveRolePermissionAsync(datas)
  },
  async getRoleApiListAsync({ commit }, roleId) {
    let apis = await permissionApi.getRoleApiListAsync(roleId)
    return apis
  },
  async getAllRoutesAsync({ commit }) {
    let routes = await permissionApi.getAllRoutesAsync()
    return routes
  },
  async getRoleRouteIdListAsync({ commit }, roleId) {
    let routes = await permissionApi.getRoleRouteIdListAsync(roleId)
    return routes
  },
  async saveRoleRouteAsync({ commit }, datas) {
    await permissionApi.saveRoleRouteAsync(datas)
  },
  async saveRouteSortAsync({ commit }, datas) {
    return await permissionApi.saveRouteSortAsync(datas)
  },
  // async getRolesAsync({ commit }) {
  //   const response = await permissionApi.getRolesAsync()
  //   return response
  // },
  async reloadRoutesAsync({ commit, dispatch }) {
    const asyncRoutes = await dispatch('generateRoutesAsync')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
