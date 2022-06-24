import { BlurImage } from './BlurImage'
import { uuid } from '@/utils/utils'
import { Image, ImageProps } from '@tarojs/components'
import {
  createIntersectionObserver,
  Current,
  previewImage,
  IntersectionObserver,
  eventCenter,
  getCurrentInstance,
} from '@tarojs/taro'
import classNames from 'classnames'
import qs from 'query-string'
import { FunctionComponent, PureComponent } from 'react'

const Loading: FunctionComponent<{ loading: boolean }> = ({ loading }) => (
  <div
    className={classNames(
      'absolute inset-0 w-full h-full transition-opacity duration-300 opacity-100 skeleton',
      !loading && 'opacity-0'
    )}
  />
)

type BaseImageState = {
  /**
   * @description 图片是否进入视野
   */
  inView: boolean

  /**
   * @description 图片是否加载完成
   */
  isLoaded: boolean
}

type BaseImageProps = ImageProps & {
  zoomable?: boolean

  /**
   * @description blurhash 值
   * @see https://github.com/woltapp/blurhash
   */
  hash?: string

  /**
   * @description 点击后可预览的图片组
   */
  previewUrls?: string[]

  /**
   * @description 用于快速设置图片宽高，通过,分割；如果不填写单位，将默认使用 rpx
   * @example 128,64
   */
  wh: string
}

export class BaseImage extends PureComponent<BaseImageProps, BaseImageState> {
  static defaultProps: Partial<BaseImageProps> = {
    zoomable: false,
  }

  readonly state: BaseImageState = {
    inView: false,
    isLoaded: false,
  }

  private imgId = uuid()
  private observer: IntersectionObserver | null

  onImageClick = (e) => {
    if (!this.state.isLoaded) return

    const { src, zoomable, onClick, previewUrls } = this.props

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
  }

  onLoadComplete = (e) => {
    this.setState({ isLoaded: true })

    const { onLoad } = this.props
    if (typeof onLoad === 'function') {
      onLoad(e)
    }
  }

  disconnectObserver = () => {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }

  get containerStyle() {
    const { wh = '' } = this.props
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
  }

  get hash() {
    const { src } = this.props
    if (!src) return undefined

    const query = qs.parseUrl(src).query
    return (query['hash'] as string) || ''
  }

  render() {
    const { isLoaded, inView } = this.state
    const { className, ...restProps } = this.props

    return (
      <div
        id={this.imgId}
        className={classNames('relative overflow-hidden', className)}
        style={this.containerStyle}
        onClick={this.onImageClick}
      >
        {inView && (
          <Image
            {...restProps}
            className='absolute inset-0 w-full h-full'
            mode={restProps.mode || 'aspectFill'}
            onLoad={this.onLoadComplete}
          />
        )}
        {!!this.hash ? (
          <BlurImage
            hash={this.hash}
            className={classNames(
              'absolute inset-0 w-full h-full transition-opacity duration-300 opacity-100 skeleton',
              isLoaded && 'opacity-0'
            )}
          />
        ) : (
          <Loading loading={!isLoaded} />
        )}
      </div>
    )
  }

  componentDidMount() {
    // @see https://docs.taro.zone/docs/react-page#onready-
    const onReadyEventId = getCurrentInstance().router!.onReady
    eventCenter.once(onReadyEventId, () => {
      this.observer = createIntersectionObserver(Current.page!)
      this.observer.relativeToViewport({ bottom: 0 }).observe('#' + this.imgId, (res) => {
        if (res.boundingClientRect.top >= 0) {
          this.setState({ inView: true })
          this.disconnectObserver()
        }
      })
    })
    // nextTick(() => {
    //   this.observer = createIntersectionObserver(Current.page!)
    //   this.observer.relativeToViewport({ bottom: 0 }).observe('#' + this.imgId, (res) => {
    //     if (res.boundingClientRect.top >= 0) {
    //       this.setState({ inView: true })
    //       this.disconnectObserver()
    //     }
    //   })
    // })
  }

  componentWillUnmount() {
    this.disconnectObserver()
  }
}
