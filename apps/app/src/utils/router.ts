import { getQRcode } from '@/apis/wx-qrcode/query'
import { pathConfig } from '@/configs'
import { reLaunch } from '@tarojs/taro'
import qs from 'query-string'

export type Params = {
  [key: string]: string | undefined
}

/**
 * 解码网页路径
 * @param path
 */
export const decodeWebPath = (path: string) => {
  const res = decodeURIComponent(path)
  return res
}

/**
 * 解码小程序二维码中记录的参数
 * @description 因为小程序二维码分享，参数长度有32位的限制，因此在后端做了字典以“扩充”32位的限制
 * @param scene
 */
const decodeScene = async (scene: string) => {
  const res = await getQRcode(scene)
  if (!res.params || typeof res.params !== 'string') return {}

  const params = qs.parse(res.params) as Params
  return params
}

/**
 * 异步解码小程序参数
 * @description 一般只在需要同时支持二维码分享和好友分享的功能页使用
 * @param params
 */
export const decode = async (params: Params): Promise<Params> => {
  if (Object.keys(params).length === 0) {
    return {}
  }

  const { scene, ...restParams } = params

  if (!!scene) {
    return await decodeScene(scene)
  } else {
    return restParams
  }
}

/**
 * 重新打开小程序
 * @description 打开的是首页
 */
export const relaunchApp = () =>
  reLaunch({
    url: pathConfig.index,
  })
