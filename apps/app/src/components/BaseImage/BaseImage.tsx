import { Image, ImageProps } from '@tarojs/components'
import { previewImage } from '@tarojs/taro'
import { useCreation } from 'ahooks'
import classNames from 'classnames'
import { uuid } from 'db'
import qs from 'query-string'
import { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { BlurImage } from '../BlurImage'
import { BLURHASH_ENABLED } from '../BlurImage/helper'
import { useRelativeToViewport } from './index.helper'

type Props = Omit<ImageProps, 'style'> & {
  src?: string
  zoomable?: boolean

  /** 点击后可预览的图片组 */
  previewUrls?: string[]

  /**
   * 用于快速设置图片宽高
   *
   * 通过,分割；如果不填写单位，将默认使用 rpx
   *
   * @example
   *   128, 64
   */
  wh?: string

  style?: React.CSSProperties
  imageStyle?: ImageProps['style']
}

const Loading: FunctionComponent<{ loading: boolean }> = ({ loading }) => (
  <div
    className={classNames(
      'skeleton absolute inset-0 h-full w-full transition-opacity duration-300',
      loading ? 'opacity-100' : 'opacity-0'
    )}
  />
)

/**
 * 通用图片展示组件
 *
 * 支持懒加载、模糊图/纯色图占位
 */
const BaseImage = ({
  className,
  wh = '',
  children,
  onLoad,
  src,
  zoomable,
  previewUrls,
  onClick,
  style,
  imageStyle,
  ...props
}: Props) => {
  const imgId = useCreation(() => uuid(), [])

  // 图片是否进入视野
  const isInView = useRelativeToViewport({
    targetSelector: `#${imgId}`,
    initialValue: false,
  })

  // 图片是否加载完成
  const [isLoaded, setIsLoaded] = useState(false)

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

  const placeholderHash = useMemo(() => {
    if (!src) {
      return undefined
    }

    if (!BLURHASH_ENABLED) {
      return undefined
    }

    const query = qs.parseUrl(src).query
    return (query['hash'] as string) || ''
  }, [src])

  const placeholderColor = useMemo(() => {
    if (!src) {
      return undefined
    }

    const query = qs.parseUrl(src).query
    return (query['color'] as string) || ''
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

  const handleLoadComplete = useCallback(
    (e) => {
      setIsLoaded(true)

      if (typeof onLoad === 'function') {
        onLoad(e)
      }
    },
    [onLoad, src]
  )

  const renderPlaceholder = useCallback(() => {
    if (!!placeholderHash) {
      return (
        <BlurImage
          hash={placeholderHash}
          className={classNames(
            'absolute inset-0 h-full w-full transition-opacity duration-300',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
        />
      )
    }

    if (!!placeholderColor) {
      return (
        <div
          className={classNames(
            'absolute inset-0 h-full w-full transition-opacity duration-300',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
          style={{ backgroundColor: placeholderColor }}
        />
      )
    }

    return <Loading loading={!isLoaded} />
  }, [placeholderHash, placeholderColor, isLoaded])

  return (
    <div
      id={imgId}
      className={classNames('relative overflow-hidden', className)}
      style={{
        ...containerStyle,
        ...style,
      }}
      onClick={handleImageClick}
    >
      {isInView && (
        <Image
          {...{
            src,
            onLoad,
            style: imageStyle,
            ...props,
          }}
          className='absolute inset-0 h-full w-full'
          mode={props.mode || 'aspectFill'}
          onLoad={handleLoadComplete}
        />
      )}
      {renderPlaceholder()}
      {children}
    </div>
  )
}

export { BaseImage }
