import { AudioMenu } from './AudioMenu'
import { AudioTimeline } from './AudioTimeline'
import IconFont from '@/components/libs/iconfont'
import { useAudioStore } from '@/models/audio'
import { audioActions } from '@/models/audio/actions'
import { playNext, playPrev, togglePlayer } from '@/models/audio/side-effects'
import { isArrayEmpty } from 'db'
import { showToast } from '@tarojs/taro'
import { useBoolean } from 'ahooks'
import { FunctionComponent, useMemo } from 'react'

const getButtonColor = (enabled: boolean) => (enabled ? '#222222' : 'rgba(34,34,34,0.25)')

/**
 * 音频控制面板
 */
export const AudioController: FunctionComponent = () => {
  const [menuVisible, { toggle: toggleMenu, setFalse: closeMenu }] = useBoolean(false)

  const { isQueue, playList, currentSn, isPlaying } = useAudioStore()

  const prevEnabled = currentSn !== 1
  const nextEnabled = currentSn !== playList.length
  const menuEnabled = !isArrayEmpty(playList) && playList.length > 1

  const control = useMemo(
    () => ({
      onPrev: () => prevEnabled && playPrev(),
      onNext: () => nextEnabled && playNext(),
      onTogglePlay: () => togglePlayer(),
      onToggleSequence: () => {
        audioActions.toggleQueue()
        showToast({ icon: 'none', title: isQueue ? '已关闭连续播放' : '已开启连续播放' })
      },
    }),
    [isQueue, prevEnabled, nextEnabled]
  )

  return (
    <div className='bg-gray-1 h-[232px] w-full flex-shrink-0 px-[30px] pt-5'>
      <AudioTimeline />
      <div className='flex w-full items-center justify-between'>
        <div onClick={control.onToggleSequence}>
          <IconFont name='audio-seq' size={40} color={getButtonColor(isQueue)} />
        </div>
        <div className='flex w-[250px] items-center justify-between'>
          <div onClick={control.onPrev}>
            <IconFont name='audio-prev' size={28} color={getButtonColor(prevEnabled)} />
          </div>
          <div onClick={control.onTogglePlay}>
            <IconFont name={isPlaying ? 'audio-pause' : 'audio-play'} size={70} />
          </div>
          <div onClick={control.onNext}>
            <IconFont name='audio-next' size={28} color={getButtonColor(nextEnabled)} />
          </div>
        </div>
        <div onClick={() => toggleMenu()}>
          <IconFont name='audio-list' size={40} color={getButtonColor(menuEnabled)} />
        </div>
      </div>
      {menuEnabled && <AudioMenu visible={menuVisible} onClose={closeMenu} />}
    </div>
  )
}
