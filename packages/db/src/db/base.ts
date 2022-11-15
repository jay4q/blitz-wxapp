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

export interface BaseUserModel {
  /**
   * 昵称
   */
  username: string

  /**
   * 头像
   */
  avatar?: string

  /**
   * 个性签名
   */
  signature?: string
}
