// @ts-nocheck
import { memo } from 'react'

type Props = {
  /**
   * 用于渲染的 html 字符串
   */
  content?: string

  /**
   * 是否允许外部链接被点击时自动复制
   * @default true
   */
  copyLink?: boolean

  /**
   * 主域名（用于链接拼接）
   */
  domain?: string

  /**
   * 图片出错时的占位图链接
   */
  errorImg?: string

  /**
   * 是否开启图片懒加载
   * @default true
   */
  lazyLoad?: boolean

  /**
   * 图片加载过程中的占位图链接
   */
  loadingImg?: string

  /**
   * 是否在播放一个视频时自动暂停其他视频
   * @default true
   */
  pauseVideo?: boolean

  /**
   * 是否允许图片被点击时自动预览
   * @default true
   */
  previewImg?: boolean

  /**
   * 是否允许图片被长按时显示菜单
   * @default true
   */
  showImgMenu?: boolean

  /**
   * 是否给每个表格添加一个滚动层使其能单独横向滚动
   * @default true
   */
  scrollTable?: boolean

  /**
   * 是否开启文本长按复制
   * @default false
   */
  selectable?: boolean

  // ...
  // 更多请参考 https://github.com/jin-yufeng/mp-html#组件属性
}

export const MpHtml = memo<Props>((props) => {
  const {
    content,
    domain,
    errorImg,
    loadingImg,
    lazyLoad = true,
    copyLink = true,
    pauseVideo = true,
    previewImg = true,
    showImgMenu = true,
    scrollTable = true,
    selectable = false,
  } = props

  const realContent = content?.replace(/\<p\>\<\/p\>/g, '<br/>')

  return (
    <div style='width:100%'>
      <mp-html
        content={realContent}
        domain={domain}
        errorImg={errorImg}
        loadingImg={loadingImg}
        copyLink={copyLink}
        lazyLoad={lazyLoad}
        pauseVideo={pauseVideo}
        previewImg={previewImg}
        showImgMenu={showImgMenu}
        scrollTable={scrollTable}
        selectable={selectable}
      />
    </div>
  )
})
