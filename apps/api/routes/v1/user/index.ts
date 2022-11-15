import { getUID, userGuard } from 'middlewares/userGuard'
import { getDatabase } from 'utils/cloudbase'
import { respond, sysTime } from 'utils/helper'
import Router from '@koa/router'
import { DB, isArrayEmpty, UpdateUserReq, UserModel } from 'db'

export const user = new Router({
  prefix: '/user',
}).use(userGuard)

// 获取当前请求用户的基本资料
user.get('/profile', async (ctx) => {
  const uid = getUID(ctx)

  try {
    const users = await getDatabase().collection(DB.user).doc(uid).get()

    if (isArrayEmpty(users.data)) {
      throw new Error('无法获取登录信息')
    }

    respond.ok(ctx, users.data[0] as UserModel)
  } catch (err: any) {
    respond.fail(500, err.message || '抱歉，无法获取登录信息')
  }
})

// 更新用户基本资料
// ! 不需要事务，因为不在乎是否更新成功，只是基础的展示信息
user.put('/profile', async (ctx) => {
  const uid = getUID(ctx)
  const userInfo = ctx.request['body'] as UpdateUserReq
  const updatedAt = sysTime.updatedAt()

  try {
    await getDatabase()
      .collection(DB.user)
      .doc(uid)
      .update({
        ...userInfo,
        ...updatedAt,
      })

    await getDatabase()
      .collection(DB.user_wx)
      .where({ uid })
      .update({
        ...userInfo,
        ...updatedAt,
      })

    respond.ok(ctx, 'OK')
  } catch (err: any) {
    respond.fail(500, err.message || '资料更新失败')
  }
})
