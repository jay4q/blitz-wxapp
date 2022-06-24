import { constConfig } from '@/configs'
import { Image } from '@tarojs/components'
import { redirectTo, useRouter } from '@tarojs/taro'
import classNames from 'classnames'
import qs from 'query-string'
import { FunctionComponent } from 'react'

type Props = {
  message: string
  className?: string
  onReload?: Function
}

/**
 * 全局的页面错误展示工具
 */
export const PageError: FunctionComponent<Props> = ({ message, className, onReload }) => {
  const { path, params } = useRouter()

  const onRefresh = async () => {
    if (onReload) {
      onReload()
    } else {
      // 重定向至当前页面
      redirectTo({
        url: path + '?' + qs.stringify(params),
      })
    }
  }

  return (
    <div className={classNames('flex flex-col items-center w-full h-full', className)} style={{ paddingTop: '40%' }}>
      <Image className='w-[400px] h-[300px]' src={constConfig.assets.empty} />
      <div className='tracking-[1px] text-gray-6 my-8 w-full px-20 text-center'>{message}</div>
      <div className='h-16 leading-[64px] w-[224px] rounded-2xl bg-gray-4 text-center text-primary-5' onClick={onRefresh}>
        点击重试
      </div>
    </div>
  )
}
