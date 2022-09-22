import { AnimationModal, AnimationModalProps } from '@/components/Modal'
import { constConfig } from '@/configs'
import { useAudioStore } from '@/models/audio'
import { playById } from '@/models/audio/side-effects'
import { ScrollView } from '@tarojs/components'
import classNames from 'classnames'
import { AudioModel } from 'db'
import { memo } from 'react'

type Props = AnimationModalProps

/**
 * 音频选项菜单
 */
export const AudioMenu = memo<Props>((modalProps) => {
  const { playList, currentSn, currentId } = useAudioStore()

  return (
    <AnimationModal {...modalProps} closeOnClickOverlay animation='bottomUp'>
      <div
        className='bg-gray-1 relative w-full rounded-t-2xl'
        style={{ boxShadow: '0rpx -2rpx 4rpx 0rpx rgba(0, 0, 0, 0.23)' }}
      >
        <div
          className='flex h-[95px] w-full flex-col items-center justify-center'
          style={{ borderBottom: '1rpx solid #f5f5f5' }}
        >
          <span className='relative'>
            {currentSn}/{playList.length}
          </span>
        </div>
        <ScrollView scrollY scrollX={false} className='max-h-[600px]'>
          {playList.map((item) => (
            <Item key={item._id} data={item} active={currentId === item._id} onClose={modalProps.onClose} />
          ))}
        </ScrollView>
        <div className='h-[105px] w-full text-center leading-[105px]' onClick={modalProps.onClose}>
          关闭
        </div>
        {constConfig.style.isIPhoneX && <div className='h-11 w-full' />}
      </div>
    </AnimationModal>
  )
})

// ---

type ItemProps = {
  data: AudioModel

  onClose: AnimationModalProps['onClose']

  /**
   * 是否被选中
   */
  active: boolean
}

const Item = memo<ItemProps>(({ data, active, onClose }) => {
  const onChange = () => {
    if (!active) {
      playById(data._id)
      onClose && onClose()
    }
  }

  return (
    <div
      className='relative flex h-[100px] w-full items-center px-[30px]'
      style={{ borderBottom: '1rpx solid #f5f5f5' }}
      onClick={onChange}
    >
      <h1 className={classNames(active ? 'text-primary-5' : 'text-gray-12')}>{data.name}</h1>
    </div>
  )
})
