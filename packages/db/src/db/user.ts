import { BaseModel, BaseUserModel } from './base'

/**
 * 用户表
 */
export interface UserModel extends BaseModel, BaseUserModel {
  /**
   * 用户关联的手机号
   * @description 手机号一般用于统一多平台
   */
  mobile?: string
}

/**
 * 微信用户表
 */
export interface UserWxModel extends BaseModel, BaseUserModel {
  uid: string

  /**
   * 微信平台统一ID
   */
  union_id?: string

  /**
   * 微信小程序的用户ID
   */
  open_id: string
}
