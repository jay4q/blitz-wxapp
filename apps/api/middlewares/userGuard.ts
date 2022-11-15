import { getDatabase } from 'utils/cloudbase'
import { respond, sysTime } from 'utils/helper'
import { getOpenId, getUnionId } from 'utils/wx'
import { isArrayEmpty, DB, UserWxModel } from 'db'
import { Context, Next } from 'koa'

const createUser = async () => {
  const manager = await getDatabase().startTransaction()

  try {
    // todo: 考虑是否要补充一个随机用户名
    // 注册用户
    const createUserResp = await manager.collection(DB.user).add({
      ...sysTime.createdAt(),
    })

    if (!createUserResp.id) {
      throw new Error('用户注册失败')
    }

    // 注册关联用户的微信用户
    const createWxUserResp = await manager.collection(DB.user_wx).add({
      open_id: getOpenId(),
      union_id: getUnionId(),
      uid: createUserResp.id,
      ...sysTime.createdAt(),
    })

    if (!createWxUserResp.id) {
      throw new Error('微信用户注册失败')
    }

    await manager.commit()
    return createUserResp.id
  } catch (e: any) {
    await manager.rollback(-100)
    throw new Error(e.message || '用户注册失败')
  }
}

const REQ_UID = 'dlj-kzl-uid'

/**
 * 设置当前请求的用户ID
 * @param ctx
 * @param id
 */
const setUID = (ctx: Context, id: string) => {
  ctx.request[REQ_UID] = id
}

/**
 * 路由中间件：判断是否是注册的微信用户，如果未注册，则会注册一个
 * @description 任何需要【用户态】的路由都必须加入
 * @param ctx
 * @param next
 */
const userGuard = async (ctx: Context, next: Next) => {
  const openId = getOpenId()

  try {
    let uid = ''
    const wxUsers = await getDatabase().collection(DB.user_wx).where({ open_id: openId }).field({ uid: true }).limit(1).get()

    if (!isArrayEmpty(wxUsers.data)) {
      // 用户已注册
      uid = (wxUsers.data[0] as UserWxModel).uid
    } else {
      // 用户未注册，自动注册一个
      uid = await createUser()
    }

    if (uid) {
      setUID(ctx, uid)
    } else {
      throw new Error('暂时无法识别您的身份，请重试')
    }
  } catch (e: any) {
    respond.fail(401, e.message || '请先登录')
  }

  await next()
}

/**
 * 获取当前请求的用户ID
 * @param ctx
 */
const getUID = (ctx: Context) => {
  const res = ctx.request[REQ_UID]

  if (!res) {
    respond.fail(400, '无法识别您的身份')
  }

  return res
}

export { getUID, userGuard }
