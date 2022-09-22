import { AudioModel } from 'db'

export type WillPlayAlbumOption = {
  module: string
  albumId: string
}

export type WillPlayOption = WillPlayAlbumOption & {
  audioId: string
}

export type AudioState = {
  /**
   * 当前专辑所属模块
   */
  module: string

  /**
   * 当前的音频专辑ID
   */
  albumId: string

  /**
   * 当前专辑下的所有音频
   */
  playList: AudioModel[]

  /**
   * 当前正在播放第几首音频
   */
  currentSn: number

  /**
   * 当前正在播放的音频ID
   */
  currentId: string

  /**
   * 是否正在播放
   */
  isPlaying: boolean

  /**
   * 是否顺序播放
   * @default true
   */
  isQueue: boolean
}

export type AudioActions = {
  unmountPlayList: () => void
  mountPlayList: (payload: {
    module: string
    albumId: string
    playList: AudioModel[]
    /** 要装载的音频ID */
    mountId: string
  }) => void
  togglePlay: (isPlaying: boolean) => void
  toggleQueue: () => void
  switchAudio: (audioId: string) => void
}

export type AudioSideEffects = {
  mountPlayerAsync: (opt: WillPlayOption) => Promise<void>
  mountPlayer: (willPlayList: AudioModel[], opt: WillPlayOption) => void
  unmountPlayer: () => void
  playOrPause: (opt: WillPlayOption) => Promise<void>
  togglePlayer: () => void
  seeking: () => void
  seeked: (s: number) => void
  playAudio: (audio: AudioModel) => void
  playPrev: () => void
  playNext: () => void
  playById: (id: string) => void
  endCurrentPlay: () => void
}
