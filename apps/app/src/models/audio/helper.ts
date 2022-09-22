import { AudioModel } from 'db'

/**
 * 根据音频ID找到播放列表中的顺序
 * @param list
 * @param audioId
 */
export const findPlayingSn = (list: AudioModel[], audioId: string) => {
  if (!audioId) return 0
  const idx = list.findIndex((item) => item._id === audioId)
  return idx + 1
}

/**
 * 根据音频ID找到播放列表中的播放项
 * @param list
 * @param audioId
 */
export const findPlayingAudio = (list: AudioModel[], audioId?: string) => {
  if (!audioId) {
    // 播放第一首 或 不播放
    return list.length !== 0 ? list[0] : undefined
  }
  const res = list.find((item) => item._id === audioId)
  return res
}

/**
 * 格式化音频时间
 * @param sec
 */
export const formatTime = (sec: number) => {
  if (sec < 60) {
    const second = sec < 10 ? `0${sec}` : sec
    return `00:${second}`
  } else {
    const _second = sec % 60
    const second = _second < 10 ? `0${_second}` : _second
    const _minute = Math.floor(sec / 60)
    const minute = _minute < 10 ? `0${_minute}` : _minute
    return `${minute}:${second}`
  }
}
