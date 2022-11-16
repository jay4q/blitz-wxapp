import { getImageMetas } from '@/components/BlurImage/helper'
import { showDialog } from '@/utils/feedback'
import { cloud } from '@tarojs/taro'
import dayjs from 'dayjs'
import { uuid } from 'db'
import qs from 'query-string'

const UPLOAD_PATH_PREFIX = 'user-uploads'

const getUniqueFilename = (file: string) => uuid(32) + '.' + file.split('.')[1]

/**
 * 获取云存储的https链接
 * @param url
 */
export const getCloudUrl = (url?: string) => {
  if (!url) return ''

  if (!url.startsWith('cloud://')) {
    return url
  }

  const re = /cloud:\/\/.*?\.(.*?)\/(.*)/
  const result = re.exec(url) as any
  return `https://${result[1]}.tcb.qcloud.la/${result[2]}`
}

/**
 * 上传图片至云存储
 * @description 注意这里返回的是云存储的https路径
 * @param file
 * @param namespace
 */
export const uploadImage = async (file: string, namespace = UPLOAD_PATH_PREFIX) => {
  try {
    const metas = await getImageMetas(file)

    if (!metas) {
      throw new Error('图片处理失败')
    }

    const resp = await cloud.uploadFile({
      filePath: file,
      cloudPath: namespace + `/${dayjs().format('YYYY-MM-DD')}/` + getUniqueFilename(file),
    })

    if (!!resp.fileID) {
      return getCloudUrl(resp.fileID) + '?' + qs.stringify(metas, { skipNull: true })
    } else {
      throw new Error('图片上传失败')
    }
  } catch (err) {
    showDialog({ title: '😭 抱歉', content: err.message || '抱歉，图片上传失败', showCancel: false })
    return undefined
  }
}
