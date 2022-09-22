import { Modal } from './Modal'
import classNames from 'classnames'
import { FunctionComponent } from 'react'

type Props = {
  visible: boolean
  className?: string
  onCancel?: () => void
  onConfirm?: () => void

  /**
   * 标题
   * @default 提示
   */
  title?: string

  /**
   * 是否显示取消按钮
   * @default true
   */
  cancelable?: boolean

  /**
   * 确认文字
   * @default 确认
   */
  okText?: string

  /**
   * 取消文字
   * @default 取消
   */
  cancelText?: string
}

/**
 * 通用的对话框
 */
export const Dialog: FunctionComponent<Props> = ({
  visible,
  children,
  className,
  onCancel,
  onConfirm,
  title = '提示',
  okText = '确认',
  cancelText = '取消',
  cancelable = true,
}) => {
  return (
    <Modal visible={visible} className={className}>
      <div className='bg-gray-1 w-[600px] rounded-lg'>
        <h1 className='h-24 w-full text-center text-[32px] font-medium leading-[96px]'>{title}</h1>
        <div
          className='max-h-[512px] w-full overflow-auto p-6'
          style={{ borderTop: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5' }}
        >
          {children}
        </div>
        <div className='flex w-full flex-row items-center justify-between p-6'>
          {cancelable && (
            <div
              className='bg-gray-3 text-primary-6 h-16 w-[264px] rounded-lg text-center font-medium leading-[64px]'
              onClick={onCancel}
            >
              {cancelText}
            </div>
          )}
          <div
            className={classNames(
              'text-gray-1 bg-primary-6 h-16 rounded-lg text-center font-medium leading-[64px]',
              cancelable ? 'w-[264px]' : 'w-full'
            )}
            onClick={onConfirm}
          >
            {okText}
          </div>
        </div>
      </div>
    </Modal>
  )
}
