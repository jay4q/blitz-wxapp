import { Input as TaroInput, InputProps } from '@tarojs/components'
import classNames from 'classnames'

import { FunctionComponent, useMemo } from 'react'
import { BaseFormTypes } from './types'

interface Props extends InputProps, BaseFormTypes {
  value: string
  onChange: (value: string) => void
}

/** 文本输入框 */
export const Input: FunctionComponent<Props> = ({ value, onChange, children, className, required = false, ...inputProps }) => {
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
    <div className={classNames('bg-gray-1 h-25 flex w-full items-center justify-between rounded-2xl px-6', className)}>
      <h1 className='text-gray-7 mr-6 flex-shrink-0'>
        {required && '*'}
        {children}
      </h1>
      <TaroInput
        {...inputProps}
        {...handlers}
        value={value} // ! 这里其实是初始值
        className='flex-grow text-right leading-10'
        placeholderStyle='color:#bfbfbf;font-size:28rpx'
      />
    </div>
  )
}
