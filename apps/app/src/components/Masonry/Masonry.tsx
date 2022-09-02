import { BaseImage } from '../BaseImage'
import { MasonryItemModel } from './types'
import { constConfig, pathConfig } from '@/configs'
import { getImageRatio } from '@/utils/utils'
import { navigateTo } from '@tarojs/taro'
import classNames from 'classnames'
import { FunctionComponent, PureComponent, ReactNode } from 'react'
import { ScrollView } from '@tarojs/components'
import { LoadMore } from '../LoadMore'

type Props = {
  className?: string

  /**
   * 加载中或加载更多中
   */
  loading?: boolean

  /**
   * 是否可以继续加载更多
   */
  noMore: boolean

  /**
   * 瀑布流原始数组
   */
  data: MasonryItemModel[]

  /**
   * 加载更多
   */
  onLoadMore: Function
}

type State = {
  leftList: MasonryItemModel[]
  rightList: MasonryItemModel[]
}

const itemWidth = (750 - 12 * 3) / 2
const itemExtraHeight = 140 + 12

/**
 * 瀑布流
 * @description 类小红书
 */
export class Masonry extends PureComponent<Props, State> {
  readonly state: State = {
    leftList: [],
    rightList: [],
  }

  // 左列高度(rpx)
  private leftH = 0
  // 右列高度(rpx)
  private rightH = 0
  // 从原始列表第几下标开始(用于快速分页)
  private flagIndex = 0

  render(): ReactNode {
    const { leftList, rightList } = this.state
    const { className, noMore, onLoadMore, loading = false } = this.props

    return (
      <ScrollView scrollY className='h-full w-full' onScrollToLower={this.onReachBottom}>
        <div className='w-full' style={{ height: (constConfig.style.statusBarHeight || 0) + 44 + 'px' }}></div>
        <div className={classNames('flex w-full flex-row justify-between px-3 pt-0', className)}>
          <ol className='w-1/2 pr-1.5'>
            {leftList.map((item) => this.renderItem(item))}
            {loading && <LeftLoading />}
          </ol>
          <ol className='w-1/2 pl-1.5'>
            {rightList.map((item) => this.renderItem(item))}
            {loading && <RightLoading />}
          </ol>
        </div>
        <LoadMore className='pt-3' loading={loading} noMore={noMore} onLoadMore={onLoadMore} />
      </ScrollView>
    )
  }

  componentDidMount() {
    if (this.props.data.length > 0) {
      this.handleMasonry()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.data.length === 0 && prevProps.data.length !== 0) {
      this.leftH = 0
      this.rightH = 0
      this.flagIndex = 0
      // 列表重置后，需要初始化
      this.setState({
        leftList: [],
        rightList: [],
      })
    } else if (this.props.data.length !== prevProps.data.length) {
      // 只有当列表长度变化才会触发重新计算
      this.handleMasonry()
    }
  }

  onReachBottom = () => {
    if (!this.props.loading && !this.props.noMore) {
      this.props.onLoadMore()
    }
  }

  renderItem = (item: MasonryItemModel) => {
    const imgRatio = getImageRatio(item.cover)
    const imgWidthHeight = `100%,${itemWidth * imgRatio}rpx`

    const onClick = () => navigateTo({ url: pathConfig.picture + `?scene=${item._id}` })

    return (
      <li className='mb-3 flex w-full flex-col items-center' key={item._id} onClick={onClick}>
        {item.cover ? (
          <BaseImage wh={imgWidthHeight} src={item.cover} className='w-full overflow-hidden rounded-t-lg' />
        ) : (
          <div className='bg-gray-6 w-full rounded-t-lg' style={{ height: itemWidth + 'rpx' }}></div>
        )}
        <div className='bg-gray-1 relative w-full rounded-b-lg px-4 pt-8 pb-6'>
          <h1 className='line-clamp-2 mb-2 font-medium leading-10'>{item.title}</h1>
        </div>
      </li>
    )
  }

  handleMasonry = () => {
    const { data = [] } = this.props

    let todoLeftList: MasonryItemModel[] = []
    let todoRightList: MasonryItemModel[] = []

    for (let i = this.flagIndex; i < data.length; i++) {
      // 列表单项高度 = 图片展示高度 + 其它元素高度 + 间距
      const height = itemWidth * getImageRatio(data[i].cover) + itemExtraHeight

      if (this.leftH < this.rightH) {
        todoLeftList.push(data[i])
        this.leftH += height
      } else {
        todoRightList.push(data[i])
        this.rightH += height
      }
    }

    // 记得移动下标
    this.flagIndex = data.length

    this.setState((s) => ({
      leftList: [...s.leftList, ...todoLeftList],
      rightList: [...s.rightList, ...todoRightList],
    }))
  }
}

const LeftLoading: FunctionComponent = () => (
  <div className='w-full'>
    <div className='skeleton mb-3 h-80 w-full rounded-lg'></div>
    <div className='skeleton mb-3 h-40 w-full rounded-lg'></div>
  </div>
)

const RightLoading: FunctionComponent = () => (
  <div className='w-full'>
    <div className='skeleton mb-3 h-40 w-full rounded-lg'></div>
    <div className='skeleton mb-3 h-80 w-full rounded-lg'></div>
  </div>
)
