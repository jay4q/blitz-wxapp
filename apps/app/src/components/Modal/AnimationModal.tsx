import { View } from '@tarojs/components'
import classNames from 'classnames'
import { CSSProperties, PureComponent } from 'react'

type AnimationType = 'centerScale' | 'bottomUp' | 'centerSlide'

export interface AnimationModalProps {
  /**
   * 是否打开
   */
  visible: boolean

  /**
   * 处理弹窗关闭
   */
  onClose?: () => void

  /**
   * 点击遮罩层关闭
   * @default false
   */
  closeOnClickOverlay?: boolean

  /**
   * 动画样式
   * @default centerScale
   */
  animation?: AnimationType
}

/**
 * 预设基础弹窗样式的弹窗
 */
export class AnimationModal extends PureComponent<AnimationModalProps> {
  render() {
    const { visible, children } = this.props

    return (
      <View
        onTouchMove={this.handleTouchMove}
        className={classNames(
          'fixed inset-0 h-full w-full transition-all duration-200 ease-in-out',
          visible ? 'visible' : 'invisible'
        )}
        style={{ zIndex: 999 }}
      >
        <View
          className={classNames(
            'bg-gray-12 absolute inset-0 h-full w-full bg-opacity-50 transition-opacity duration-200 ease-in-out',
            visible ? 'opacity-100' : 'opacity-0'
          )}
          onClick={this.handleClickOverlay}
        />
        <View
          className={classNames('absolute transition-all duration-200 ease-in-out', visible ? 'opacity-100' : 'opacity-0')}
          style={this.animationStyle}
        >
          {children}
        </View>
      </View>
    )
  }

  get animationStyle(): CSSProperties {
    const { visible, animation = 'centerScale' } = this.props

    if (animation === 'centerScale') {
      return {
        top: '50%',
        left: '50%',
        transformOrigin: '0% 0%',
        transform: visible
          ? 'scale(1, 1) translate(-50%, calc(-96rpx - 50%))'
          : 'scale(0.9, 0.9) translate(-50%, calc(-96rpx - 50%))',
      }
    }

    if (animation === 'centerSlide') {
      return {
        top: '50%',
        left: '50%',
        transformOrigin: '0% 0%',
        transform: visible ? 'translate(-50%, -50%)' : 'translate(-50%, -40%)',
      }
    }

    if (animation === 'bottomUp') {
      return {
        left: 0,
        right: 0,
        bottom: 0,
        transform: visible ? 'translateY(0%)' : 'translateY(25%)',
      }
    }

    return {}
  }

  handleTouchMove = (e) => {
    e.stopPropagation()
  }

  handleClickOverlay = () => {
    const { closeOnClickOverlay = false, onClose } = this.props

    if (closeOnClickOverlay && typeof onClose === 'function') {
      onClose()
    }
  }
}
