import { constConfig } from '@/configs'
import classNames from 'classnames'
import { FunctionComponent } from 'react'

type Props = {
  title: string

  /**
   * 是否置灰
   *
   * @default false
   */
  disabled?: boolean

  onClick?: () => void
}

/**
 * 固定于页面底部的
 *
 * 一般用于表单提交页
 */
export const BottomSubmit: FunctionComponent<Props> = ({ title, onClick, disabled = false }) => {
  return (
    <div className={classNames('bg-gray-1 w-full p-6', constConfig.style.isIPhoneX && 'pb-12')}>
      <div
        className={classNames(
          'text-gray-1 h-[88px] w-full rounded-[44px] text-center text-[32px] leading-[88px]',
          disabled ? 'bg-gray-6' : 'bg-primary-6'
        )}
        onClick={onClick}
      >
        {title}
      </div>
    </div>
  )
}
