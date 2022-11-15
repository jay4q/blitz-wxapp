import { BaseModel } from './base'

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
