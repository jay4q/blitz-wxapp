/**
 * 微信小程序分享用内容映射表
 * @description 解决小程序码最多只能记录最多32位的字符串内容限制
 */
export interface WxQrcodeModel {
  _id: string

  /**
   * 查询字符串
   * @description 例如 a=123456&b=hello
   */
  params: string
}
