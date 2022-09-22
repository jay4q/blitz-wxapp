import create from 'zustand'
import { AudioState } from './types'

export const useAudioStore = create<AudioState>(() => ({
  module: '',
  playList: [],
  albumId: '',
  currentSn: 0,
  currentId: '',
  isPlaying: false,
  isQueue: true,
}))
