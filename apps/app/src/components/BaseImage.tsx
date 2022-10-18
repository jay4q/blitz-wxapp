import { Image, ImageProps } from '@tarojs/components'
import Taro, { createIntersectionObserver, useDidShow, previewImage } from '@tarojs/taro'
import { useDebounceFn } from 'ahooks'
import classNames from 'classnames'
import { uuid } from 'db'
import qs from 'query-string'
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BlurImage } from './BlurImage'

// 全局存储已经 加载成功的图片
const ws = new Set()

type Props = ImageProps & {
  zoomable?: boolean

  /**
   * 点击后可预览的图片组
   */
  previewUrls?: string[]

  /**
   * 用于快速设置图片宽高
   * @description 通过,分割；如果不填写单位，将默认使用 rpx
   * @example 128,64
   */
  wh?: string
}

const Loading: FunctionComponent<{ loading: boolean }> = ({ loading }) => (
  <div
    className={classNames(
      'skeleton absolute inset-0 h-full w-full opacity-100 transition-opacity duration-300',
      !loading && 'opacity-0'
    )}
  />
)

const BaseImage = ({ className, wh = '', children, onLoad, src, zoomable, previewUrls, onClick, ...props }: Props) => {
  // 图片是否进入视野
  const [isInView, setIsInView] = useState(!!ws.has(src))
  // 图片是否加载完成
  const [isLoaded, setIsLoaded] = useState(!!ws.has(src))

  const createObserver = useCallback(() => {
    return createIntersectionObserver(Taro.getCurrentInstance().page!)
  }, [])

  const observerRef = useRef<Taro.IntersectionObserver | undefined>(createObserver())

  const imgId = useMemo(() => {
    return uuid()
  }, [])

  const containerStyle = useMemo(() => {
    const [width, height] = wh
      .trim()
      .split(',')
      .map((s) => {
        const numStr = s.trim()
        if (/^\d+(\.\d+)?$/.test(numStr)) {
          // 如果是纯数字，就补上 rpx 为单位
          return numStr + 'rpx'
        } else {
          return numStr
        }
      })

    return { width, height }
  }, [wh])

  const hash = useMemo(() => {
    if (!src) return undefined

    const query = qs.parseUrl(src).query
    return (query['hash'] as string) || ''
  }, [src])

  const handleImageClick = useCallback(
    (e) => {
      if (!isLoaded) {
        return
      }

      if (typeof onClick === 'function') {
        onClick(e)
      } else if (zoomable) {
        if (Array.isArray(previewUrls) && previewUrls.length > 0) {
          previewImage({
            current: src,
            urls: previewUrls,
          })
        } else {
          previewImage({
            urls: [src],
          })
        }
      }
    },
    [isLoaded, onClick, previewUrls, src, zoomable]
  )

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = undefined
    }
  }, [observerRef])

  const handleLoadComplete = useCallback(
    (e) => {
      setIsLoaded(true)
      ws.add(src)

      if (typeof onLoad === 'function') {
        onLoad(e)
      }
    },
    [onLoad, src]
  )

  const { run: handleRelativeToViewport } = useDebounceFn(
    () => {
      if (!observerRef.current) {
        return
      }

      if (isInView) {
        return
      }

      disconnect()

      observerRef.current = createObserver()

      observerRef.current.relativeToViewport({ bottom: 0 }).observe('#' + imgId, (res) => {
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

  return (
    <div
      id={imgId}
      className={classNames('relative overflow-hidden', className)}
      style={containerStyle}
      onClick={handleImageClick}
    >
      {isInView && (
        <Image
          {...{
            src,
            onLoad,
            ...props,
          }}
          className='absolute inset-0 h-full w-full'
          mode={props.mode || 'aspectFill'}
          onLoad={handleLoadComplete}
        />
      )}
      {!!hash ? (
        <BlurImage
          hash={hash}
          className={classNames(
            'absolute inset-0 h-full w-full opacity-100 transition-opacity duration-300',
            isLoaded && 'opacity-0'
          )}
        />
      ) : (
        <Loading loading={!isLoaded} />
      )}
      {children}
    </div>
  )
}

export { BaseImage }
