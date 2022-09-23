import { callFunction } from '@/cloudbase'
import { AudioModel } from 'db'

/**
 * 获取专辑内的音频
 * @param collection 对应集合名词，使用DB.xxx获取即可
 * @param targetId 对应集合元组id
 */
export const getAlbum = async (collection: string, targetId: string) => {
  const resp = await callFunction<AudioModel[]>(`/audio/${collection}/${targetId}`)
  return resp.data || []
}
