import { getSystemInfoSync } from '@tarojs/taro'

/**
 * px转rpx
 * @param px 
 * @param width 
 */
export const convertPx2Rpx = (px: number, width?: number) => {
  const windowWidth = width || getSystemInfoSync().windowWidth
  return px * (750 / windowWidth)
}

/**
 * rpx转px
 * @param rpx 
 * @param width 
 */
export const convertRpx2px = (rpx: number, width?: number) => {
  const windowWidth = width || getSystemInfoSync().windowWidth
  return rpx * (windowWidth / 750)
}