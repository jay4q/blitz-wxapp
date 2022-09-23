import Router from '@koa/router'
import { audio } from './audio'

const v1 = new Router({
  prefix: '/v1',
})

// 音频
v1.use(audio.routes())

export { v1 }
