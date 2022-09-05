import { PageError } from './PageError'
import { PageLoading } from './PageLoading'
import { IResponse } from 'db'
import { Block } from '@tarojs/components'
import { FunctionComponent } from 'react'

type Props = {
  loading: boolean

  /**
   * @description 可以调整外部布局，这样可以适用于页面的局部
   */
  className?: string

  /**
   * @description 可以传入网络请求数据交给组件判断，或者自行判断传入是否成功
   */
  data?: IResponse<any> | boolean

  /**
   * @description 自定义的重试方法
   */
  onReload?: Function
}

/**
 * 页面初始用逻辑页
 * @description 服务于需要异步请求需要获取初始化数据的页面；支持加载中、异常重启
 */
export const PageWrapper: FunctionComponent<Props> = ({ loading, className, children, onReload, data = true }) => {
  if (loading) {
    return <PageLoading />
  }

  if (!data) {
    return <PageError message='无法获取相应内容，请重试' className={className} onReload={onReload} />
  } else if (typeof data === 'object' && data.code !== 200) {
    return <PageError message={data.message} className={className} onReload={onReload} />
  }

  return <Block>{children}</Block>
}
