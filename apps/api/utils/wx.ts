import { getWXContext } from 'wx-server-sdk'
import { respond } from './helper'

export const getUnionId = () => {
  const { FROM_UNIONID, UNIONID } = getWXContext()
  // 如果开发环境失效无法获取 unionid 那就先拿自己的做调试
  const unionId = UNIONID || FROM_UNIONID || undefined
  return unionId
}

export const getOpenId = () => {
  const { FROM_OPENID, OPENID } = getWXContext()
  const openId = OPENID || FROM_OPENID || ''
  if (!openId) respond.fail(401, '请以微信用户身份访问')
  return openId
}
