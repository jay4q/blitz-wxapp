import { BlurCanvas } from './BlurCanvas'
import { Block, View } from '@tarojs/components'
import classNames from 'classnames'
import qs from 'query-string'
import { PureComponent } from 'react'

type Props = {
  /**
   * @description 图片链接
   */
  src: string

  /**
   * @description 图片样式，请不要填写高度；为什么必填？因为至少需要指定一个宽度
   */
  className: string
}

/**
 * 响应式的模糊图
 * @description 传入图片链接，但只按照原图比例并以模糊图形式展示，因此只需要提供一个宽度即可
 */
export class BlurResponsiveImage extends PureComponent<Props> {
  get metas() {
    const { src } = this.props
    if (!src) return { hash: undefined, hw: 1 }

    const query = qs.parseUrl(src).query
    return {
      hash: (query['hash'] as string) || '',
      hw: Number(query['height'] || 1) / Number(query['width'] || 1),
    }
  }

  render() {
    const { className } = this.props
    const { hash, hw } = this.metas

    if (!hash) return <Block></Block>

    return (
      <View className={classNames('relative', className)} style={{ paddingBottom: hw * 100 + '%' }}>
        <BlurCanvas hash={hash} className='absolute w-full h-full inset-0' />
      </View>
    )
  }
}
