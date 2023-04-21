import { showToast } from '@/utils/feedback'
import { Button, ButtonProps, Image } from '@tarojs/components'
import { getStorageSync, setStorageSync } from '@tarojs/taro'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { FunctionComponent } from 'react'

type Props = {
  value?: string
  onChange: (src: string) => void
  className?: string
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

/** 增加一次头像上传计数 */
export const incAvatarUploadCount = () => {
  try {
    const currentDate = dayjs().format('YYYYMMDD')
    const count = getUploadCount()

    setStorageSync(STORAGE_KEY_COUNT, { date: currentDate, count: count + 1 })
  } catch (err: any) {}
}

/** 选择用户头像 */
export const AvatarPicker: FunctionComponent<Props> = ({ value, onChange, className }) => {
  const onChooseAvatar: ButtonProps['onChooseAvatar'] = async (e) => {
    console.log(e)
    try {
      if (getUploadCount() >= THRESHOLD_COUNT) {
        showToast({ title: `抱歉，一天最多只能修改${THRESHOLD_COUNT}次头像` })
        return
      }

      const fileUrl: string = e.detail.avatarUrl // ! 微信端已自动压缩成头像大小的小图

      if (!!fileUrl) {
        onChange(fileUrl)
      }
    } catch (_: any) {}
  }

  return (
    <Button openType='chooseAvatar' onChooseAvatar={onChooseAvatar} className={classNames('mx-0', className)}>
      <div className='flex flex-col items-center'>
        {!!value ? (
          <Image className='h-44 w-44 rounded-full' src={value} mode='aspectFill' />
        ) : (
          <div className='bg-gray-6 h-40 w-40 rounded-full'></div>
        )}
        <div className='text-primary-6 bg-gray-1 mt-6 rounded-lg px-8 py-3 text-2xl font-semibold tracking-wide'>编辑头像</div>
      </div>
    </Button>
  )
}
