import { getUser, updateUser } from '@/apis/user/query'
import { UpdateUserReq, UserModel } from 'db'
import { useEffect } from 'react'
import create from 'zustand'

type State = {
  /**
   * 是否正在获取用户信息
   */
  loading: boolean

  /**
   * 用户信息
   */
  userInfo?: UserModel

  /**
   * 获取用户信息
   * @description 若未注册，后端会自动帮助注册一个用户身份；前端不需要考虑未注册的情况
   */
  getUserInfo: typeof getUser

  /**
   * 更新用户信息
   */
  updateUserInfo: (req: UpdateUserReq) => Promise<boolean>
}

/**
 * 用户全局信息管理工具
 */
const useUser = create<State>((set) => {
  const getUserInfo: typeof getUser = async () => {
    set({ loading: true })
    const resp = await getUser()

    if (resp?.data) {
      set({ userInfo: resp.data, loading: false })
    } else {
      set({ loading: false })
    }

    return resp
  }

  const updateUserInfo = async (req: UpdateUserReq) => {
    try {
      const resp = await updateUser(req)

      if (!!resp.data) {
        set((prevState) => ({
          ...prevState,
          userInfo: {
            ...prevState.userInfo!, // ! 若能更新用户信息，那本地必然存有一份老的
            ...req,
          },
        }))
        return true
      } else {
        throw new Error('拿不到个人信息')
      }
    } catch (e) {
      return false
    }
  }

  return {
    loading: false,
    userInfo: undefined,
    getUserInfo,
    updateUserInfo,
  }
})

/**
 * 初始化用户信息
 * @description 若已初始化过，就不会重复触发
 */
const useUserInit = () => {
  const userState = useUser()
  const { getUserInfo, userInfo } = userState
  const isDataReady = !!userInfo

  useEffect(() => {
    if (!isDataReady) {
      // ! 仅用户数据不存在时，才会尝试获取
      getUserInfo()
    }
  }, [isDataReady])

  return { ...userState, isDataReady }
}

export { useUser, useUserInit }
