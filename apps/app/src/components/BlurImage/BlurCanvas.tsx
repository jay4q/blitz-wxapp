import { Image, View } from '@tarojs/components'
import { ImageProps } from '@tarojs/components/types/Image'
import { createOffscreenCanvas } from '@tarojs/taro'
import { decode } from 'blurhash'
import { uuid } from 'db'
import { PureComponent } from 'react'

type Props = Omit<ImageProps, 'src'> & {
  punch?: number

  /**
   * 模糊图哈希
   */
  hash: string

  /**
   * 模糊图绘制宽度
   */
  width?: number

  /**
   * 模糊图绘制高度
   */
  height?: number
}

type State = {
  blurUrl?: string
}

export class BlurCanvas extends PureComponent<Props, State> {
  static defaultProps: Partial<Props> = {
    width: 32,
    height: 32,
  }

  readonly state: State = {
    blurUrl: undefined,
  }

  canvasId = uuid()
  // canvasContext2D 对象
  canvasContext: CanvasRenderingContext2D

  draw = () => {
    const { width, height, hash, punch } = this.props
    let context: CanvasRenderingContext2D = this.canvasContext

    if (!context) {
      // 记得初始化
      // @ts-ignore
      const canvas = createOffscreenCanvas({ type: '2d', width: width!, height: height! })
      context = this.canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
    }

    // 记得先清空
    context.clearRect(0, 0, width!, height!)

    // 尝试绘制模糊图
    const pixels = decode(hash, width!, height!, punch)
    const imageData = context.createImageData(width!, height!)
    imageData.data.set(pixels)
    context.putImageData(imageData, 0, 0)

    // 获取 img 可展示的图片
    const blurUrl = context.canvas.toDataURL()
    this.setState({ blurUrl })
  }

  render() {
    const { blurUrl } = this.state
    const { hash, height, width, punch, ...restProps } = this.props

    if (!blurUrl) return <View></View>

    return <Image style={{ display: 'block' }} {...restProps} src={blurUrl} />
  }

  componentDidMount() {
    this.draw()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.hash !== this.props.hash) {
      this.draw()
    }
  }
}
