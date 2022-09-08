import { CSSProperties } from 'react'
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

/**
 * 解决子节点在进行透明度变化时，忽略父节点 overflow:hidden 和圆角的问题
 * @see https://stackoverflow.com/questions/42297303/css-opacity-transition-ignoring-overflowhidden-in-chrome-safari
 */
export const fixOpacityIgnoreHiddenStyle: CSSProperties = { backfaceVisibility: 'hidden', transform: 'translate3d(0, 0, 0)' }
