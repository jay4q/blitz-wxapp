import { useAudioStore } from '.'
import { audioActions } from './actions'
import { findPlayingAudio } from './helper'
import { AudioSideEffects, WillPlayOption } from './types'
import { getMany } from '@/api/audio/query'
import { constConfig } from '@/configs'
import { hideLoading, showLoading, showToast } from '@/utils/feedback'
import { BackgroundAudioManager, getBackgroundAudioManager, useDidShow, useDidHide } from '@tarojs/taro'
import { AudioModel } from 'db'
import { useEffect, useState } from 'react'

const { getState } = useAudioStore

let _manager: BackgroundAudioManager

const launchListeners = () => {
  _manager.onWaiting(() => {
    showLoading('音频缓冲中...')
  })

  _manager.onCanplay(() => {
    hideLoading()
  })

  _manager.onPlay(() => {
    hideLoading()
    audioActions.togglePlay(true)
  })

  _manager.onPause(() => {
    audioActions.togglePlay(false)
  })

  _manager.onStop(() => {
    audioActions.togglePlay(false)
  })

  _manager.onEnded(() => {
    endCurrentPlay()
  })

  _manager.onError(() => {
    showToast({ title: '音频播放错误' })
    audioActions.togglePlay(false)
  })
}

/**
 * 单例模式创建后台音频管理工具
 */
const getManager = () => {
  if (!_manager) {
    _manager = getBackgroundAudioManager()
    launchListeners()
    return _manager
  }
  return _manager
}

const _audioManager = (() => {
  const isAudioMounted = () => !!getManager().src
  const doStop = () => {
    if (isAudioMounted()) {
      getManager().stop()
    }
  }
  const doSwitch = (target: AudioModel) => {
    if (isAudioMounted()) {
      // 如果后台在播放，记得先暂停
      getManager().stop()
    }
    getManager().src = target.src
    getManager().title = target.name
    getManager().coverImgUrl = target.cover || ''
    getManager().epname = constConfig.app.name
  }

  return {
    isAudioMounted,
    stop: doStop,
    switch: doSwitch,
    pause: () => {
      if (isAudioMounted()) {
        getManager().pause()
      }
    },
    play: (target?: AudioModel) => {
      if (isAudioMounted()) {
        getManager().play()
      } else if (target) {
        // 切换曲目
        doSwitch(target)
      }
    },
    seek: (s: number) => {
      if (isAudioMounted()) {
        getManager().seek(s)
      }
    },
  }
})()

/**
 * 手动装载播放列表
 * @param playList
 * @param opt
 */
export const mountPlayer: AudioSideEffects['mountPlayer'] = (playList, opt) => {
  if (playList.length === 0) return

  const willPlayAudio = findPlayingAudio(playList, opt.audioId)
  // 装载播放列表
  audioActions.mountPlayList({
    playList,
    module: opt.module,
    albumId: opt.albumId,
    mountId: willPlayAudio ? willPlayAudio._id : '',
  })
  // 播放音频
  willPlayAudio && _audioManager.switch(willPlayAudio)
}

/**
 * 异步地装载播放列表
 * @param opt
 */
export const mountPlayerAsync: AudioSideEffects['mountPlayerAsync'] = async (opt) => {
  showLoading('获取音频中...')
  const willPlayList = await getMany(opt.module, opt.albumId)
  hideLoading()
  // 装载音频
  mountPlayer(willPlayList, opt)
}

/**
 * 终止播放
 */
export const unmountPlayer: AudioSideEffects['unmountPlayer'] = () => {
  audioActions.unmountPlayList()
  _audioManager.stop()
}

/**
 * 切换播放状态；后台播放中的音频
 */
export const togglePlayer: AudioSideEffects['togglePlayer'] = () => {
  const { isPlaying, currentId, playList } = getState()

  if (isPlaying) {
    _audioManager.pause()
  } else {
    if (_audioManager.isAudioMounted()) {
      _audioManager.play()
    } else {
      _audioManager.play(findPlayingAudio(playList, currentId))
    }
  }
}

/**
 * 播放某一首音频
 * @param audio
 */
export const playAudio: AudioSideEffects['playAudio'] = (audio) => {
  _audioManager.switch(audio)
  audioActions.switchAudio(audio._id)
  // TODO: 可以在这里，记录播放数
}

/**
 * 播放指定的一首
 * @param id 音频ID
 */
export const playById: AudioSideEffects['playById'] = (id) => {
  const { playList } = getState()
  const audio = findPlayingAudio(playList, id)

  audio && playAudio(audio)
}

/**
 * 同一专辑下，处理某一音频的播放/暂停
 * @param opt
 */
export const playOrPause: AudioSideEffects['playOrPause'] = async (opt) => {
  const { module, albumId, currentId } = getState()

  if (module !== opt.module && albumId !== opt.albumId) {
    await mountPlayerAsync(opt)
  } else {
    if (currentId === opt.audioId) {
      togglePlayer()
    } else {
      playById(opt.audioId)
    }
  }
}

/**
 * 正在切换进度时
 * @description 停止播放
 */
export const seeking: AudioSideEffects['seeking'] = () => {
  _audioManager.pause()
}

/**
 * 手动切换进度结束后
 * @description 调整进度并开始播放
 * @param s
 */
export const seeked: AudioSideEffects['seeked'] = (s) => {
  _audioManager.seek(s)
  _audioManager.play()
}

/**
 * 播放上一首
 */
export const playPrev: AudioSideEffects['playPrev'] = () => {
  const { currentSn, playList } = getState()

  if (currentSn !== 1) {
    const audio = playList[currentSn - 2]
    playAudio(audio)
  }
}

/**
 * 播放上一首
 */
export const playNext: AudioSideEffects['playNext'] = () => {
  const { currentSn, playList } = getState()

  if (currentSn !== playList.length) {
    const audio = playList[currentSn]
    playAudio(audio)
  }
}

/**
 * 结束播放后的动作；顺序播放或停止
 */
export const endCurrentPlay = () => {
  const { isQueue, currentSn, playList } = getState()

  if (isQueue && currentSn !== playList.length) {
    // 顺序播放
    playNext()
    return
  }
  // 顺序播放结束 或 单曲播放结束
  audioActions.togglePlay(false)
}

/**
 * 音频播放启动器；自动播放策略；用于小程序中单例模式的音频页
 * @param opt
 */
export const useAlbumLauncher = (opt: WillPlayOption) => {
  const { module: prevModule, albumId: prevAlbumId, currentId: prevAudioId } = useAudioStore()

  useEffect(() => {
    if (!opt.module || !opt.albumId) {
      showToast({
        title: '无效的音频参数',
      })
    } else if (prevModule === opt.module && prevAlbumId === opt.albumId) {
      // 切换播放 或 继续播放
      if (prevAudioId !== opt.audioId) {
        playById(opt.audioId)
      } else {
        getManager().play()
      }
    } else {
      // 不同专辑，需要重新加载
      mountPlayerAsync(opt)
    }
  }, [])
}

/**
 * 监听音频时间轴变化
 * @description 仅限单例页的时间轴使用，请勿在多个组件内注册
 * @param cab
 */
export const useTimelineUpdate = (cab: (duration: number, current: number) => void) => {
  const [isVisible, setVisible] = useState(true)

  useDidShow(() => {
    setVisible(true)
  })

  useDidHide(() => {
    setVisible(false)
  })

  useEffect(() => {
    if (isVisible) {
      // 仅当前页对用户可见时更新
      getManager().onTimeUpdate(() => {
        const { currentTime, duration } = getManager()
        cab && cab((duration && Math.floor(duration)) || 0, (currentTime && Math.floor(currentTime)) || 0)
      })
    }

    return () => {
      getManager().onTimeUpdate(() => {})
    }
  }, [isVisible])
}
