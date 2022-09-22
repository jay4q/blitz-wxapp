import { cloud } from '@tarojs/taro'
import { DB, WxQrcodeModel } from 'db'

/**
 * 获取微信小程序码中记录的原始内容
 * @param scene
 */
export const getQRcode = async (scene: string) => {
  const resp = await cloud.database().collection(DB.wx_qrcode).doc(scene).get({})
  return (resp.data as WxQrcodeModel) || {}
}
