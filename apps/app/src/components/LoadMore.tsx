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
  const actionText = loading ? '🏄 加载中' : noMore ? '🤷‍♂️ 没有更多啦' : '👉 点击加载更多'

  const onClick = () => {
    if (!loading && !noMore) {
      onLoadMore()
    }
  }

  return (
    <div
      className={classNames('item-center flex w-full justify-center pb-6', constConfig.style.isIPhoneX && 'pb-12', className)}
    >
      <span className='text-gray-6 text-2xl' onClick={onClick}>
        {actionText}
      </span>
    </div>
  )
})
