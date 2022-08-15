import { Context, Next } from 'koa'
import { constConfig } from 'utils/config'
import { BusinessError } from 'utils/helper'

/**
 * 【全局中间件】集中式的异常处理
 * @param ctx
 * @param next
 */
export const errors = async (ctx: Context, next: Next) => {
  if (!constConfig.isLocal) {
    console.log('<====== 云函数入参 =====>')
    console.log((ctx.req as any)?.apiGateway?.event)
    console.log('<=====================>')
  }

  try {
    await next()
    if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        message: '找不到对应的内容',
      }
    }
  } catch (err: any) {
    if (err instanceof BusinessError || err.name === 'BusinessError') {
      // 业务异常处理
      ctx.status = 200
      ctx.body = {
        code: err.code,
        data: err.data,
        message: err.message,
      }
    } else {
      console.log('<====== 异常响应日志 =====>')
      console.log('❌ 异常如下')
      console.log(err)
      console.log('<====== 异常响应结束 =====>')

      // 所有未业务化的异常
      ctx.status = 200
      ctx.body = {
        code: 500,
        message: err.message || '未知异常，请稍后再试',
      }
    }
  }
}
