import { useAudioStore } from '.'
import { findPlayingSn } from './helper'
import { AudioActions } from './types'

const { setState } = useAudioStore

export const audioActions: AudioActions = {
	unmountPlayList: () => {
		setState({
			module: '',
			playList: [],
			albumId: '',
			currentSn: 0,
			currentId: '',
			isPlaying: false,
			isQueue: true,
		})
	},
	mountPlayList: payload => {
		const { mountId, ...restPayload } = payload
		setState(() => ({
			...restPayload,
			currentId: mountId,
			currentSn: findPlayingSn(restPayload.playList, mountId)
		}))
	},
	togglePlay: isPlaying => {
		setState(() => ({ isPlaying }))
	},
	toggleQueue: () => {
		setState(s => ({ isQueue: !s.isQueue }))
	},
	switchAudio: audioId => {
		setState(prevState => ({
			currentId: audioId,
			currentSn: findPlayingSn(prevState.playList, audioId)
		}))
	}
}
