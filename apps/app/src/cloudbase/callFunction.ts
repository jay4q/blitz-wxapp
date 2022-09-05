import { CallFunctionOptions } from './types'
import { constConfig } from '@/configs'
import { cloud, showModal } from '@tarojs/taro'
import { IResponse } from 'db'

const { callFunction: $callFunction } = cloud

/**
 * ! 务必使用该方法发起云函数请求
 * @param path
 * @param options
 */
export const callFunction = async <Result = any>(path: string, options?: CallFunctionOptions): Promise<IResponse<Result>> => {
  const { data, params, headers, method = 'GET', skipErrors = [], enableErrorToast = true } = options || {}

  try {
    const body = typeof data === 'object' ? JSON.stringify(data) : data

    let finalHeaders = headers || {}

    const resp = await $callFunction({
      name: process.env.WXAPP_PUBLIC_TCB_FUNC,
      data: {
        body: body,
        httpMethod: method,
        queryStringParameters: params,
        path: '/' + process.env.WXAPP_PUBLIC_TCB_FUNC_VERSION + path,
        headers: finalHeaders,
      },
    })

    if (resp?.result) {
      const res = resp.result as IResponse<Result>

      // 抛出业务异常
      if (res.code !== 200 && enableErrorToast && !skipErrors.includes(res.code)) {
        showModal({
          title: '😭 抱歉',
          showCancel: false,
          confirmText: '完成',
          content: res.message,
          confirmColor: constConfig.colors[5],
        })
      }

      return res
    } else {
      throw new Error(resp?.errMsg || '无法获取请求结果')
    }
  } catch (e) {
    const message = e.message || '请检查你的网络连接'
    showModal({
      title: '😭 抱歉',
      showCancel: false,
      confirmText: '完成',
      content: message,
      confirmColor: constConfig.colors[5],
    })
    return { message, code: 500 }
  }
}
