import { constConfig } from '@/configs'
import Taro from '@tarojs/taro'

interface WeappToastConfig {
  title: string
  mask?: boolean
  icon?: 'none' | 'success' | 'loading'
  duration?: number
}

interface WeappDialogConfig {
  title?: string
  content: string
  cancelText?: string
  confirmText?: string
  showCancel?: boolean
  onSuccess?: Function
  onCancel?: Function
}

/**
 * Toast弹窗
 * @param cfg
 */
export const showToast = (cfg: WeappToastConfig) => {
  const newConfig = {
    title: cfg.title,
    mask: cfg.mask || false,
    icon: cfg.icon || 'none',
    duration: cfg.duration || 1500,
  }

  if (
    (newConfig.icon !== 'none' && newConfig.title.length <= 7) ||
    (newConfig.icon === 'none' && newConfig.title.length <= 25)
  ) {
    Taro.showToast(newConfig as any)
  } else {
    showDialog({
      showCancel: false,
      content: newConfig.title,
    })
  }
}

/**
 * 打开微信对话框
 * @param cfg
 */
export const showDialog = (cfg: WeappDialogConfig) => {
  const { content, onCancel, onSuccess, showCancel = true, title = '😉 提示', cancelText = '取消', confirmText = '确认' } = cfg

  Taro.showModal({
    title,
    content,
    showCancel,
    cancelText,
    confirmText,
    confirmColor: constConfig.colors[5],
    success: (res) => {
      if (res.confirm) {
        onSuccess && onSuccess()
      } else {
        onCancel && onCancel()
      }
    },
  })
}

/**
 * 打开加载窗口
 * @param msg
 */
export const showLoading = (msg?: string) => {
  Taro.showLoading({
    mask: true,
    title: msg || '处理中...',
  })
}

/**
 * 关闭加载窗口
 */
export const hideLoading = () => Taro.hideLoading()
