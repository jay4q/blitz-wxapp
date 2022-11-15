import { callFunction } from '@/cloudbase'
import { UpdateUserReq, UserModel } from 'db'

/**
 * 获取用户信息
 */
export const getUser = async () =>
  await callFunction<UserModel>('/user/profile', {
    enableErrorToast: false,
  })

/**
 * 更新用户信息
 * @param data
 */
export const updateUser = async (data: UpdateUserReq) =>
  await callFunction<string>('/user/profile', {
    data,
    method: 'PUT',
    enableErrorToast: false,
  })
