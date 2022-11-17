import { Input } from '@tarojs/components'
import { FunctionComponent, useMemo } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
}

/**
 * 编辑用户名
 */
export const NicknameInput: FunctionComponent<Props> = ({ value, onChange }) => {
  const handlers = useMemo(() => {
    const handleChange = (e: any) => {
      const { value } = e.detail
      onChange(value)
      // 必须返回，用于UI层展示
      return value
    }

    return {
      onInput: handleChange,
      // 目的为了解决小程序最后一次输入可能出现的中文字符丢失bug
      onBlur: handleChange,
    }
  }, [onChange])

  return (
    <div className='mb-16 w-full' style={{ borderBottom: '3rpx solid #f5f5f5' }}>
      <h1 className='text-gray-6 leading-8'>昵称</h1>
      <Input
        {...handlers}
        type='nickname'
        value={value} // 这里其实是初始值
        placeholder='微信用户'
        className='h-24 w-full text-[28px]'
        placeholderStyle='color:#bfbfbf;font-size:28rpx'
      />
    </div>
  )
}
