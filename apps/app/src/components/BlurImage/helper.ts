import { canIUse, createOffscreenCanvas, getImageInfo, getSystemInfoSync } from '@tarojs/taro'
import { encode } from 'blurhash'

const COMPRESS_THRESHOLD = 128

/**
 * 是否可以使用模糊哈希
 * 目前来看，PC端不支持
 */
const BLURHASH_ENABLED = (() => {
  if (!canIUse('createOffscreenCanvas')) {
    return false
  }

  const systemInfo = getSystemInfoSync()

  if (systemInfo.platform === 'windows' || systemInfo.platform === 'mac') {
    return false
  }

  return true
})()

type BlurhashInput = {
  width: number
  height: number
  src: string
}

const getBlurhash = async ({ src, width, height }: BlurhashInput) => {
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

  // 获取哈希
  return encode(imageData.data, imageData.width, imageData.height, 4, 4)
}

/**
 * 获取图片优化数值
 * @description 宽高、模糊哈希
 * @param src
 */
const getImageMetas = async (src: string) => {
  try {
    const { width, height } = await getImageInfo({ src })

    let hash: string | undefined = undefined

    if (BLURHASH_ENABLED) {
      hash = await getBlurhash({ src, width, height })
    }

    return { width, height, hash }
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export { getImageMetas, BLURHASH_ENABLED }
