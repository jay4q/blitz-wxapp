import { isCloudUrl, uploadImage } from '@/apis/uploads/mutation'
import { BottomSubmit } from '@/components/BottomSubmit'
import { PageWrapper } from '@/components/PageWrapper'
import { useUser, useUserInit } from '@/models/user'
import { showToast } from '@/utils/feedback'
import { useForm } from '@/utils/hooks'
import { navigateBack } from '@tarojs/taro'
import { UpdateUserReq } from 'db'
import { FunctionComponent } from 'react'
import { AvatarPicker, incAvatarUploadCount } from './components/AvatarPicker'
import { NicknameInput } from './components/NicknameInput'
import './index.css'

// 编辑资料
const Index: FunctionComponent = () => {
  const { loading, isDataReady } = useUserInit()

  return (
    <PageWrapper loading={loading} data={isDataReady}>
      {isDataReady && <Page />}
    </PageWrapper>
  )
}

export default Index

// ! 由于腾讯经常性更换微信昵称、头像接口，因此还是考虑让用户自行决定编辑头像和昵称
// @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html
const Page: FunctionComponent = () => {
  const { userInfo, updateUserInfo } = useUser()
  const { values, isSubmitting, handleChange, handleSubmit } = useForm<UpdateUserReq, boolean>({
    initialData: {
      avatar: userInfo?.avatar,
      username: userInfo?.username || '',
      signature: userInfo?.signature || '',
    },
    onBeforeSubmit: (values) => {
      if (!values.avatar) {
        showToast({ title: '请上传您的头像' })
        return false
      }

      if (!values.username) {
        showToast({ title: '请编辑您的昵称' })
        return false
      }

      return true
    },
    submittingMsg: '更新资料中',
    onSubmit: async (values) => {
      // ! 个人信息没有变化，就没必要发起请求直接成功
      if (values.avatar === userInfo?.avatar && values.username === userInfo?.username) {
        return true
      }

      let avatar: string | undefined

      if (!!values.avatar) {
        if (!isCloudUrl(values.avatar)) {
          // ! 先将本地上传至云存储再保存
          avatar = await uploadImage(values.avatar)

          if (!!avatar) {
            incAvatarUploadCount()
            handleChange('avatar')(avatar)
          } else {
            return false
          }
        } else {
          avatar = values.avatar
        }
      }

      const resp = await updateUserInfo({ ...values, avatar })
      return resp
    },
    onAfterSubmit: () => navigateBack(),
  })

  return (
    <>
      <main className='flex w-full flex-col items-center p-6'>
        <AvatarPicker value={values.avatar} onChange={handleChange('avatar')} />
        <NicknameInput value={values.username} onChange={handleChange('username')} />
      </main>
      <BottomSubmit title={isSubmitting ? '更新资料中...' : '确认更新'} disabled={isSubmitting} onClick={handleSubmit} />
    </>
  )
}
