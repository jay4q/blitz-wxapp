import { constConfig } from '@/configs'
import classNames from 'classnames'
import { memo } from 'react'

type Props = {
  loading: boolean
  noMore?: boolean
  onLoadMore: Function
  className?: string
}

/**
 * 加载更多状态按钮
 */
export const LoadMore = memo<Props>(({ loading, noMore, onLoadMore, className }) => {
  const actionText = loading ? '正在加载，请稍等;)' : noMore ? '没有更多啦;)' : '👉 点击加载更多'

  const onClick = () => {
    if (!loading && !noMore) {
      onLoadMore()
    }
  }

  return (
    <div
      className={classNames('w-full pb-6 flex item-center justify-center', constConfig.style.isIPhoneX && 'pb-12', className)}
    >
      <span className='text-2xl text-gray-6' onClick={onClick}>
        {actionText}
      </span>
    </div>
  )
})
