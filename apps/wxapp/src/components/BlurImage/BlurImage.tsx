import { BlurCanvas } from './BlurCanvas'
import { View } from '@tarojs/components'
import { ViewProps } from '@tarojs/components/types/View'
import classNames from 'classnames'
import { memo } from 'react'

type Props = ViewProps & {
  hash: string
  punch?: number

  /**
   * @description 画布宽度；建议不要超过128，默认32
   */
  resolutionWidth?: number

  /**
   * @description 画布高度；建议不要超过128，默认32
   */
  resolutionHeight?: number
}

export const BlurImage = memo<Props>(
  ({ hash, punch, className, resolutionWidth = 32, resolutionHeight = 32, ...restProps }) => {
    return (
      <View className={classNames('relative overflow-hidden', className)} {...restProps}>
        <BlurCanvas
          hash={hash}
          punch={punch}
          width={resolutionWidth}
          height={resolutionHeight}
          className='absolute inset-0 w-full h-full'
        />
      </View>
    )
  }
)
