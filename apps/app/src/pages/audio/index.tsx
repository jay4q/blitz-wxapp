import { AudioContent, AudioController } from './components'
import './index.css'
import { PageWrapper } from '@/components/PageWrapper'
import { pathConfig } from '@/configs'
import { useAudioStore } from '@/models/audio'
import { useAlbumLauncher } from '@/models/audio/side-effects'
import { decode, Params } from '@/utils/router'
import { useRouter, useShareAppMessage } from '@tarojs/taro'
import { useRequest } from 'ahooks'
import qs from 'query-string'
import { FunctionComponent } from 'react'
import shallow from 'zustand/shallow'

const isParamsValid = (params?: Params) => !!params?.module && !!params?.albumId && !!params?.id

// 音频专用的播放页
const Index: FunctionComponent = () => {
  const { params } = useRouter()
  const { data, loading } = useRequest(async () => await decode(params))
  const isReady = isParamsValid(data)

  return (
    <PageWrapper loading={loading} data={isReady}>
      {isReady && <Page params={data!} />}
    </PageWrapper>
  )
}

const Page: FunctionComponent<{ params: Params }> = ({ params }) => {
  const [playList, currentSn] = useAudioStore((s) => [s.playList, s.currentSn], shallow)
  const audio = playList[currentSn - 1]

  useAlbumLauncher({
    module: params.module as string,
    albumId: params.albumId as string,
    audioId: params.id as string,
  })

  useShareAppMessage(() => {
    return {
      path: pathConfig.audio + '?' + qs.stringify(params), // 需要重新拼接分享参数
      title: audio?.name,
      imageUrl: audio?.cover,
    }
  })

  return (
    <>
      <AudioContent />
      <AudioController />
    </>
  )
}

export default Index
