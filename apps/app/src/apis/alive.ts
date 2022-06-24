import { callFunction } from '@/cloudbase'

export const checkAlive = async () => await callFunction('/alive')
