import { getFileSystemManager, env } from '@tarojs/taro'
import qs from 'query-string'

export const wait = async (duration = 1000) => new Promise((resolve) => setTimeout(() => resolve(''), duration))

/**
 * 去除对象中的无效参数
 * @param data
 */
export const trimInvalid = <Data extends object>(data: Data) => {
  const res = Object.keys(data).reduce((result, key) => {
    const v = data[key]
    if (v === undefined || v === '' || v == NaN || v === null) {
      return result
    } else {
      return {
        ...result,
        [key]: data[key],
      }
    }
  }, {} as Data)
  return res
}

/**
 * 将base64转换成url
 * @param b64
 */
export const base64Url = async (b64) => {
  try {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(b64) || []
    if (!format) throw new Error('链接解析失败')

    const filePath = `${env.USER_DATA_PATH}/tmp_base64-${Date.now()}.${format}`

    await getFileSystemManager().writeFile({
      filePath,
      data: bodyData,
      encoding: 'base64',
    })
    return filePath
  } catch (e) {
    console.log(e)
    return undefined
  }
}

/**
 * 配合 useRequest 加载更多使用；获得下一步加载时用的基础分页数据
 * @param r
 */
export const getLoadMoreReq = (r?: { list: any[]; [key: string]: any }) => {
  const total = r?.total || 0
  const length = r?.list.length || 0
  const nextPage = !total || !length ? 1 : Math.ceil(length / 10) + 1

  return {
    pageSize: 10,
    current: nextPage,
  }
}

/**
 * 获取图片的高宽比
 * @description 一般来说宽都是确定的，但是高度是要计算的
 * @param url
 */
export const getImageRatio = (url?: string) => {
  if (!url) return 1

  const query = qs.parseUrl(url).query
  return (Number(query['height']) || 1) / (Number(query['width']) || 1)
}
