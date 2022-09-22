export interface BaseModel {
  _id: string
  created_at: number
  updated_at: number
  deleted_at: number
}

export interface IResponse<T = any> {
  code: number
  message: string
  data?: T
}

export interface IPagingReq {
  current: number
  pageSize: number
}

export interface IPagingResp<T = any> {
  total: number
  list: T[]
}

// ---

export interface AudioModel extends BaseModel {
  /**
   * 排序顺序（排序前提是ref和ref_id）
   */
  sort?: number

  /**
   * 关联的实例
   * @description 使用实例对应表的名称即可
   */
  ref?: string

  /**
   * 关联的实例id
   */
  ref_id?: string

  /**
   * 音频名称
   */
  name: string

  /**
   * 音频链接
   */
  src: string

  /**
   * 封面
   */
  cover?: string

  /**
   * 时长，单位秒
   */
  duration: number

  /**
   * 富文本
   */
  content?: string
}

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
