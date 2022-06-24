import { createOffscreenCanvas, getImageInfo } from '@tarojs/taro'
import { encode } from 'blurhash'

const COMPRESS_THRESHOLD = 256

/**
 * 获取图片模糊哈希
 * @param src
 */
export const getBlurhash = async (src: string) => {
  try {
    // 首先获取图片宽高
    const { width, height } = await getImageInfo({ src })
    let targetWidth,
      targetHeight = 0

    if (width > COMPRESS_THRESHOLD) {
      targetWidth = COMPRESS_THRESHOLD
      targetHeight = (height * COMPRESS_THRESHOLD) / width
    } else {
      targetWidth = width
      targetHeight = height
    }

    // 其次将图片绘制到画布
    // @ts-ignore
    const canvas = createOffscreenCanvas({ type: '2d', width: targetWidth, height: targetHeight })
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    // @ts-ignore
    const image = canvas.createImage()
    await new Promise((resolve) => {
      image.onload = resolve
      image.src = src
    })
    // @ts-ignore
    context.drawImage(image, 0, 0, width, height, 0, 0, targetWidth, targetHeight)

    // 得到图片数据
    const imageData = context.getImageData(0, 0, targetWidth, targetHeight)

    // 最后获取哈希
    const res = encode(imageData.data, imageData.width, imageData.height, 4, 4)
    return res
  } catch (e) {
    console.log(e)
    return false
  }
}
