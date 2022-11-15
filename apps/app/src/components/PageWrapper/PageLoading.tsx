import classNames from 'classnames'
import { FunctionComponent } from 'react'

type Props = {
  className?: string
}

export const Bouncing: FunctionComponent = () => (
  <div className='relative h-20 w-20'>
    <div className='bg-primary-6 loading-bouncing absolute inset-0 h-full w-full rounded-full opacity-60' />
    <div
      className='bg-primary-6 loading-bouncing absolute inset-0 h-full w-full rounded-full opacity-60'
      style={{ animationDelay: '-1s' }}
    />
  </div>
)

/**
 * 全局的页面加载工具
 */
export const PageLoading: FunctionComponent<Props> = ({ className }) => (
  <div className={classNames('flex h-full w-full flex-col items-center', className)} style={{ paddingTop: '60%' }}>
    <Bouncing />
  </div>
)
