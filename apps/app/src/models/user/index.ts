import { getUser, updateUser } from '@/apis/user/query'
import { UpdateUserReq, UserModel } from 'db'
import create from 'zustand'

type State = {
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

export const useUser = create<State>((set) => {
  const openLoading = () => set({ loading: true })
  const closeLoading = () => set({ loading: false })

  const getUserInfo: typeof getUser = async () => {
    openLoading()
    const resp = await getUser()

    if (resp?.data) {
      set({ userInfo: resp.data, loading: false })
    } else {
      closeLoading()
    }

    return resp
  }

  const updateUserInfo = async (req: UpdateUserReq) => {
    try {
      openLoading()
      const resp = await updateUser(req)

      if (!!resp.data) {
        set((prevState) => ({
          ...prevState,
          loading: false,
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
      closeLoading()
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
