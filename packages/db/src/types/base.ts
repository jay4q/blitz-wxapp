export interface IResponse<T = any> {
  code: number
  message: number
  data?: T
}

export interface IPagingReq {
  current: number
  pageSize: number
}

export interface IPaginResp<T = any> {
  total: 0
  list: T[]
}
