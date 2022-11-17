import { showToast } from '@/utils/feedback'
import { Image } from '@tarojs/components'
import { chooseMedia, getStorageSync, setStorageSync } from '@tarojs/taro'
import dayjs from 'dayjs'
import { isArrayEmpty } from 'db'
import { FunctionComponent } from 'react'

type Props = {
  value?: string
  onChange: (src: string) => void
}

const THRESHOLD_COUNT = 3
const STORAGE_KEY_COUNT = 'dlj.kzl.user.avatarCount'

const getUploadCount = () => {
  try {
    const value = getStorageSync(STORAGE_KEY_COUNT) as { date: string; count: number }
    const currentDate = dayjs().format('YYYYMMDD')

    if (currentDate === value.date) {
      return value.count || 0
    } else {
      return 0
    }
  } catch (err: any) {
    return 0
  }
}

/**
 * 增加一次头像上传计数
 */
export const incAvatarUploadCount = () => {
  try {
    const currentDate = dayjs().format('YYYYMMDD')
    const count = getUploadCount()

    setStorageSync(STORAGE_KEY_COUNT, { date: currentDate, count: count + 1 })
  } catch (err: any) {}
}

/**
 * 选择用户头像
 */
export const AvatarPicker: FunctionComponent<Props> = ({ value, onChange }) => {
  const onAvatarChange = async () => {
    if (getUploadCount() >= THRESHOLD_COUNT) {
      showToast({ title: `抱歉，一天最多只能修改${THRESHOLD_COUNT}次头像` })
      return
    }

    const selectedFiles = await chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
    })

    if (!isArrayEmpty(selectedFiles.tempFiles)) {
      // ! 注意，图片上传延后至点击保存时
      const file = selectedFiles.tempFiles[0].tempFilePath
      onChange(file)
    }
  }

  return (
    <div className='mb-16 flex flex-col items-center' onClick={onAvatarChange}>
      {!!value ? (
        <Image className='h-36 w-36 rounded-full' src={value} mode='aspectFill' />
      ) : (
        <div className='bg-gray-6 h-36 w-36 rounded-full'></div>
      )}
      <div className='text-primary-6 mt-3'>更换头像</div>
    </div>
  )
}
