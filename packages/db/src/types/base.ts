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
