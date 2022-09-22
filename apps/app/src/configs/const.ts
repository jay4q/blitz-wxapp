import { generate } from '@ant-design/colors'
import { getSystemInfoSync } from '@tarojs/taro'

const getStatusBarAndNavigatorHeight = () => {
  const infos = getSystemInfoSync()
  // @ts-ignore
  const navigator = infos.screenHeight > infos.safeArea.bottom ? infos.screenHeight - infos.safeArea.bottom : 0

  return {
    navigatorHeight: navigator,
    statusBarHeight: infos.statusBarHeight,
    isIPhoneX: !!navigator,
  }
}

export const constConfig = {
  app: {
    name: process.env.WXAPP_PUBLIC_APP_NAME,
  },
  colors: generate('#1778fe'),
  style: {
    ...getStatusBarAndNavigatorHeight(),
  },
  limit: {
    pageSize: 10,
  },
  assets: {
    empty: 'https://6465-dev-8gesrxwdc929eef0-1258640577.tcb.qcloud.la/sketch/empty.png',
  },
}
