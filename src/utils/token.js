import store from '@/store'
const tokenKey = 'token'

export const getToken = () => {
  return store.getters['user/token']
}

export const setToken = (token) => {
  localStorage.setItem(tokenKey, token)
}

export const removeToken = () => {
  localStorage.removeItem(tokenKey)
}
