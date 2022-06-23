import Taro from '@tarojs/taro'
import { showLoading, showDialog, hideLoading, showToast } from '../feedback'

const _saveImageToPhotosAlbum = async (filePath: string) => {
  try {
    await Taro.saveImageToPhotosAlbum({ filePath })
    showToast({
      icon: 'success',
      title: '图片已保存至相册',
    })
  } catch (e) {
    console.log('[error]saveImageToPhotosAlbum：', e)
  }
}

/**
 * 保存至相册 & 检查权限
 * @param filePath 图片路径
 */
export const saveImageToPhotosAlbum = async (filePath: string) => {
  showLoading()

  const settings = await Taro.getSetting()
  if (!settings.authSetting['scope.writePhotosAlbum']) {
    try {
      await Taro.authorize({
        scope: 'scope.writePhotosAlbum',
      })
      // 授权成功后直接保存
      await _saveImageToPhotosAlbum(filePath)
    } catch (e) {
      showDialog({
        title: '用户未授权',
        content: '如需将图片存放至相册，请在授权管理中打开“相册”。',
        onSuccess: () => Taro.openSetting(),
      })
    }
  } else {
    await _saveImageToPhotosAlbum(filePath)
  }

  hideLoading()
}