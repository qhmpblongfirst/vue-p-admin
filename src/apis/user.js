import { postAsync } from '@/utils/request'

/**
 * 登录异步方法
 * @param {object} data - 登录数据
 * @returns {Promise} - 登录响应
 */
export const loginAsync = async (data) => {
  return {
    return_code: '0',
    return_msg: '登录失败',
    data: {
      token: '123456',
    },
  }
  try {
    const response = await postAsync('/login', data)
    return response
  } catch (error) {
    return {
      return_code: '0',
      return_msg: '登录失败',
      data: {
        token: '123456',
      },
    }
  }
}
