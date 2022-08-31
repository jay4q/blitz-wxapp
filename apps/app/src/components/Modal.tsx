import classNames from 'classnames'
import { PureComponent } from 'react'

type Props = {
  visible: boolean
  closeOnClickOverlay?: boolean
  onClose?: () => void
  className?: string
}

export class Modal extends PureComponent<Props> {
  onOverlayClose = () => {
    if (this.props.closeOnClickOverlay && this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { visible, className, children } = this.props

    return (
      <div
        className={classNames(
          'fixed inset-0 z-50 h-full w-full transition-all duration-300',
          visible ? 'visible' : 'invisible'
        )}
      >
        <div
          onClick={this.onOverlayClose}
          className={classNames(
            'absolute inset-0 h-full w-full bg-gray-12 transition-opacity duration-300',
            visible ? 'opacity-50' : 'opacity-0'
          )}
        ></div>
        <div
          style={{ top: 'calc(50% - 48px)' }}
          className={classNames(
            'absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition duration-300',
            className,
            visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          )}
        >
          {children}
        </div>
      </div>
    )
  }
}
