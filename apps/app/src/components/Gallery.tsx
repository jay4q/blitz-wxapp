import { BaseImage } from './BaseImage'
import { constConfig } from '@/configs'
import { getImageRatio } from '@/utils/utils'
import { Swiper, SwiperItem } from '@tarojs/components'
import { isArrayEmpty } from 'db'
import { FunctionComponent, memo, useState } from 'react'

type Props = {
  loading: boolean

  /**
   * 封面
   * @description 这个封面一般是列表页封面，也可以作为图集头图
   */
  cover?: string

  /**
   * 图集
   */
  pics?: string[]
}

/**
 * 类似小红书详情页的图集
 * @description 常用于详情页
 */
export const Gallery = memo<Props>(({ loading, cover, pics }) => {
  const data = getCoverAndPics({ cover, pics })

  if (loading || isArrayEmpty(data)) {
    return <div className='w-full h-[750px] skeleton'></div>
  }

  return <GalleryBase data={data} />
})

// ---

const GalleryBase: FunctionComponent<{ data: string[] }> = ({ data }) => {
  const isDotEnabled = data.length > 1
  const firstImageRatio = getImageRatio(data[0])
  const firstImageHeight = 750 * firstImageRatio // !rpx

  const [current, setCurrent] = useState(0)
  const onCurrentChange = (e) => setCurrent(e.detail.current)

  return (
    <div className='relative w-full' style={{ height: firstImageHeight + 'rpx' }}>
      <Swiper
        autoplay={false}
        className='w-full h-full'
        current={current}
        indicatorDots={isDotEnabled}
        indicatorColor='#bfbfbf'
        indicatorActiveColor={constConfig.colors[5]}
        onChange={onCurrentChange}
      >
        {data.map((src, i) => (
          <SwiperItem key={src} className='w-full h-full bg-gray-1 flex justify-center items-center'>
            <BaseImage wh={getRealWh({ baseRatio: firstImageRatio, baseHeight: firstImageHeight, index: i, src })} src={src} />
          </SwiperItem>
        ))}
      </Swiper>
      <IndicatorNumbers current={current} total={data.length} />
    </div>
  )
}

const getRealWh = (data: { index: number; baseRatio: number; baseHeight: number; src: string }) => {
  const { baseRatio, baseHeight, src, index } = data

  if (index === 0) {
    return '100%,100%' // ! 说明是第一张图，直接填满即可
  }

  const ratio = getImageRatio(src)

  if (ratio < baseRatio) {
    // ! 宽图
    const height = 750 * ratio
    return `100%,${height}rpx`
  } else {
    // ! 窄图
    const width = baseHeight / ratio
    return `${width}rpx,100%`
  }
}

const getCoverAndPics = (data: { cover?: string; pics?: string[] }) => {
  const { cover, pics } = data
  const res = !!cover ? [cover, ...(pics || [])] : pics || []
  return res
}

const IndicatorNumbers: FunctionComponent<{ current: number; total: number }> = ({ current, total }) => {
  if (total <= 1) {
    return <div></div>
  }

  return (
    <div
      className='absolute right-6 top-6 px-4 h-[42px] leading-[42px] rounded-[21px] text-2xl text-gray-1 bg-gray-11 bg-opacity-80'
      // style={{ top: (constConfig.style.statusBarHeight || 0) + 128 + 'rpx' }}
    >
      {current + 1}/{total}
    </div>
  )
}
