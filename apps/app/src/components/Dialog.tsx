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
      <div className='w-[600px] bg-gray-1 rounded-lg'>
        <h1 className='w-full h-24 leading-[96px] text-[32px] text-center font-medium'>{title}</h1>
        <div className='w-full p-6 max-h-[512px] overflow-auto' style={{ border: '1px solid #f5f5f5' }}>
          {children}
        </div>
        <div className='w-full p-6 flex flex-row items-center justify-between'>
          {cancelable && (
            <div
              className='w-[264px] h-16 leading-[64px] text-center bg-gray-3 rounded-lg text-primary-6 font-medium'
              onClick={onCancel}
            >
              {cancelText}
            </div>
          )}
          <div
            className={classNames(
              'h-16 leading-[64px] text-center text-gray-1 rounded-lg bg-primary-6 font-medium',
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
