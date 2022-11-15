import { canIUse, createIntersectionObserver, getCurrentInstance, useDidShow, getSystemInfoSync } from '@tarojs/taro'
import { useDebounceFn } from 'ahooks'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 图片是否可以进行图片优化（懒加载、模糊图）
 */
export const canOptimized = (() => {
  if (!canIUse('createOffscreenCanvas')) {
    return false
  }

  const systemInfo = getSystemInfoSync()

  if (systemInfo.platform === 'windows' || systemInfo.platform === 'mac') {
    return false
  }

  return true
})()

export const useRelativeToViewport = ({
  targetSelector,
  margins = { bottom: 0 },
}: {
  /**
   * 默认是否在页面中
   */
  initialValue?: boolean
  /**
   * 监听对象
   * #id .class 等
   */
  targetSelector: string
  /**
   * 节点布局区域的边界
   */
  margins?: Taro.IntersectionObserver.RelativeToViewportMargins
}) => {
  const [isInView, setIsInView] = useState(false)

  const createObserver = useCallback(() => {
    return createIntersectionObserver(getCurrentInstance().page!)
  }, [])

  const observerRef = useRef<Taro.IntersectionObserver | undefined>(createObserver())

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = undefined
    }
  }, [observerRef])

  const { run: handleRelativeToViewport } = useDebounceFn(
    () => {
      if (!observerRef.current) {
        return
      }

      if (isInView) {
        disconnect()
        return
      }

      disconnect()

      observerRef.current = createObserver()

      observerRef.current.relativeToViewport(margins).observe(targetSelector, (res) => {
        if (res.boundingClientRect.top >= 0) {
          setIsInView(true)
          disconnect()
        }
      })
    },
    { wait: 10 }
  )

  useEffect(() => {
    return () => {
      return disconnect()
    }
  }, [disconnect])

  useEffect(() => {
    handleRelativeToViewport()
  }, [handleRelativeToViewport])

  useDidShow(() => {
    handleRelativeToViewport()
  })

  return isInView
}
