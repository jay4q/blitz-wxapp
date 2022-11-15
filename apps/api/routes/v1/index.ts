import Router from '@koa/router'
import { audio } from './audio'
import { user } from './user'

const v1 = new Router({
  prefix: '/v1',
})

// 音频
v1.use(audio.routes())
// 用户
v1.use(user.routes())

export { v1 }
