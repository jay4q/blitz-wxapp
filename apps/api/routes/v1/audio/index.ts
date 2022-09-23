import Router from '@koa/router'
import { DB, isArrayEmpty } from 'db'
import { respond } from 'utils/helper'
import { getDatabase } from 'utils/cloudbase'

const audio = new Router({
  prefix: '/audio',
})

// 获取当前内容关联的音频
audio.get('/:collection/:id', async (ctx) => {
  try {
    const id = ctx.params['id'] as string
    const collection = ctx.params['collection'] as string

    if (!collection || !id) {
      throw new Error('抱歉，不存在音频')
    }

    const _ = getDatabase().command

    const resp = await getDatabase()
      .collection(DB.audio)
      .where({
        deleted_at: 0,
        ref_id: id,
        ref: collection,
      })
      .get()

    if (isArrayEmpty(resp.data)) {
      throw new Error('抱歉，不存在音频')
    }

    respond.ok(ctx, resp.data)
  } catch (e) {
    respond.ok(ctx, [])
  }
})

export { audio }
