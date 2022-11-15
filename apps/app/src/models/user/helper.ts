import { showToast } from '@/utils/feedback'
import { useUser } from '.'

/**
 * 是否注册过用户
 */
export const isRegistered = () => !!useUser.getState().userInfo

/**
 * 柯里化；检查是否需要注册
 * @param handler
 */
export const withAuth = async (handler: Function) => {
  if (isRegistered()) {
    handler()
  } else {
    const resp = await useUser.getState().getUserInfo()
    if (resp.data) {
      handler()
    } else {
      showToast({ icon: 'none', title: '登录失败，请重试' })
    }
  }
}
