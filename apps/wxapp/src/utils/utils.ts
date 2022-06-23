import { getFileSystemManager, env } from '@tarojs/taro'

export const isArrayEmpty = (arr?: any[]) => !Array.isArray(arr) || arr.length === 0

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
        [key]: data[key]
      }
    }
  }, {} as Data)
  return res
}

/**
 * 生成uuid
 * @param len
 * @param radix
 */
export const uuid = (len = 8, radix = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const value: string[] = []
  let i = 0
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) value[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    /* eslint-disable-next-line */
    value[8] = value[13] = value[18] = value[23] = '-'
    value[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!value[i]) {
        r = 0 | (Math.random() * 16)
        value[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return value.join('')
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
      encoding: 'base64'
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
    current: nextPage
  }
}
