import { BaseImage } from '@/components/BaseImage'
import { MpHtml } from '@/components/MpHtml'
import { useAudioStore } from '@/models/audio'
import { FunctionComponent } from 'react'
import shallow from 'zustand/shallow'

/**
 * 音频内容展示
 */
export const AudioContent: FunctionComponent = () => {
  const [playList, currentSn] = useAudioStore((s) => [s.playList, s.currentSn], shallow)
  const audio = playList[currentSn - 1]

  return (
    <div className='w-full flex-grow overflow-auto p-[30px]'>
      {!!audio && (
        <>
          {
            <div className='mx-auto mb-10 h-[418px] w-[418px] overflow-hidden rounded-2xl'>
              <BaseImage zoomable src={audio.cover} wh='100%,100%' className='bg-gray-3' />
            </div>
          }
          <h1 className='mb-6 block w-full text-center text-4xl font-medium leading-[60px]'>{audio.name}</h1>
          {audio.content && <MpHtml content={audio.content} />}
        </>
      )}
    </div>
  )
}
