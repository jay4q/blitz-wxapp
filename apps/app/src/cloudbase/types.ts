export type IResponse<T = any> = {
  code: number
  message: string
  data?: T
}

export interface CallFunctionOptions {
  data?: any
  params?: object
  headers?: object
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

  /**
   * @description 是否给用户显示异常信息
   * @default true
   */
  enableErrorToast?: boolean

  /**
   * @description 需要跳过自动处理的错误码；enableErrorToast 能够做到自动将异常将，但部分异常还是需要留给业务函数单独去处理
   */
  skipErrors?: number[]
}
