import { postAsync } from '@/utils/request'
/**
 * 生成路由
 * @param {Array} routes 路由
 * @returns {Promise<any>} 返回结果
 */
export const generateRoutesAsync = async (routes) => {
  console.log('这里要生成路由，提交到数据库')
  return
  try {
    for (let i = 0; i < routes.length; i++) {
      const r = routes[i]
      r.route_title = r.meta?.title || r.name
      r.icon = r.meta?.icon

    for (let j = 0; j < r.children?.length || 0; j++) {
      const c = r.children[j]
      c.route_title = c.meta?.title
      c.icon = c.meta?.icon
      }
    }
    return await postAsync('/permission/create-routes', { routes })
  } catch (error) {
    console.error('生成路由失败', error)
  }
}

export const getAccessedRoutesAsync = async () => {
  try {
    let res = await postAsync('/permission/manager-route-list')
    return res
  } catch (error) {
    console.error('获取已访问路由失败', error)
  }
}


export async function getAllApisAsync() {
  let res = await postAsync('/permission/api-list')
  return res
}

export async function getAllRolesAsync() {
  let res = await postAsync('/permission/role-list')
  return res
}

export async function saveRolePermissionAsync(datas) {
  let res = await postAsync('/permission/save-role-permission', datas, true)
  return res
}

export async function getRoleApiListAsync(roleId) {
  let res = await postAsync(`/permission/role-api-list?roleId=${roleId}`)
  return res
}

export async function saveRoleAsync(role) {
  let res = await postAsync('/permission/save-role', role, true)
  return res
}
export async function deleteRoleAsync(roleId) {
  let res = await postAsync(`/permission/delete-role?roleId=${roleId}`,null, true)
  return res
}
export const resumeRoleAsync = async (roleId) => {
  let res = await postAsync(`/permission/resume-role?roleId=${roleId}`,null, true)
  return res
}

export async function getAllRoutesAsync(){
  let res = await postAsync('/permission/route-list')
  return res
}

export async function getRoleRouteIdListAsync(roleId){
  let res = await postAsync(`/permission/role-route-id-list?roleId=${roleId}`)
  return res
}

export async function saveRoleRouteAsync(routes){
  let res = await postAsync('/permission/save-role-route', routes, true)
  return res
}
export async function saveRouteSortAsync(routes){
  let res = await postAsync('/permission/route-sort', routes, true)
  return res
}

export function getRoles() {
  return request({
    url: '/api/permission/roles',
    method: 'get'
  })
}

export function updateRouteSort(routes) {
  return request({
    url: '/api/routes/sort',
    method: 'put',
    data: { routes }
  })
}
