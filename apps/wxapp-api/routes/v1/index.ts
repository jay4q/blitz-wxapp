import Router from '@koa/router'
import { respond } from 'utils/helper'

const v1 = new Router({
  prefix: '/v1',
})

v1.get('/alive', async (ctx) => {
  respond.ok(ctx, 'hello world')
})

export { v1 }
