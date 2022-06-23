import classNames from 'classnames'
import { FunctionComponent } from 'react'

type Props = {
  className?: string
}

/**
 * 全局的页面加载工具
 */
export const PageLoading: FunctionComponent<Props> = ({ className }) => {
  return (
    <div className={classNames('flex flex-col items-center w-full h-full', className)} style={{ paddingTop: '60%' }}>
      <div className='relative w-20 h-20'>
        <div className='absolute inset-0 w-full h-full opacity-60 rounded-full bg-primary-6 loading-bouncing' />
        <div
          className='absolute inset-0 w-full h-full opacity-60 rounded-full bg-primary-6 loading-bouncing'
          style={{ animationDelay: '-1s' }}
        />
      </div>
    </div>
  )
}
