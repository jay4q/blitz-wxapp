import { constConfig } from '@/configs'
import { useAudioStore } from '@/models/audio'
import { formatTime } from '@/models/audio/helper'
import { seeked, seeking, useTimelineUpdate } from '@/models/audio/side-effects'
import { Slider } from '@tarojs/components'
import { memo, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'

/**
 * 音频进度条
 */
export const AudioTimeline = memo(() => {
  const isPlaying = useAudioStore((s) => s.isPlaying, shallow)

  const [tl, setTimeline] = useState({
    duration: 0,
    currentTime: 0,
  })

  const fmtCurrent = formatTime(tl.currentTime)
  const fmtDuration = useMemo(() => formatTime(tl.duration), [tl.duration])

  const onSeeked = (evt) => {
    seeked(evt.detail.value)
  }
  const onSeeking = () => {
    isPlaying && seeking()
  }

  useTimelineUpdate((dT, cT) => {
    setTimeline({
      duration: dT,
      currentTime: cT,
    })
  })

  return (
    <>
      <Slider
        max={tl.duration}
        value={tl.currentTime}
        onChange={onSeeked}
        onChanging={onSeeking}
        blockSize={6}
        blockColor={constConfig.colors[5]}
        activeColor={constConfig.colors[5]}
        backgroundColor='#E5E5E5'
        className='m-0 w-full p-0'
      />
      <div className='mt-1.5 mb-3.5 flex w-full items-center justify-between'>
        <span className='text-2xl'>{fmtCurrent}</span>
        <span className='text-2xl'>{fmtDuration}</span>
      </div>
    </>
  )
})
