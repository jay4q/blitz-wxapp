import { cloud } from '@tarojs/taro'

export const initCloudbase = () => {
  cloud.init({
    env: process.env.TARO_PUBLIC_TCB_ENV,
    traceUser: true,
  })
}
