import { checkAlive } from '@/apis/alive'
import { BaseImage } from '@/components/BaseImage'
import { showModal } from '@tarojs/taro'
import { useRequest } from 'ahooks'
import classNames from 'classnames'
import { FunctionComponent } from 'react'

// 首页
const Index: FunctionComponent = () => {
  useRequest(async () => {
    const resp = await checkAlive()

    if (resp.data) {
      showModal({
        title: '请求内容',
        content: resp.data,
      })
    }

    return resp
  })

  return (
    <>
      <div className={classNames('w-[256px] h-[128px] bg-gray-5', 'text-primary-6 leading-[128px] font-bold text-center')}>
        测试按钮
      </div>
      <BaseImage
        wh='256,512'
        src='https://6d75-museum-1g8w6o4l75c810d8-1306317407.tcb.qcloud.la/admin-uploads/e4ddbb3662578ff70058c49e60a3ea88/2022-04-29/f48e620fff0645ec94c7109aed902dd8.JPG?color=%23d0a472&hash=UeKd%40%3BRj~qt6s%3Aj%5BWCjsogoft6j%5BWXayoKay&height=4227&width=3248'
      />
    </>
  )
}

export default Index
