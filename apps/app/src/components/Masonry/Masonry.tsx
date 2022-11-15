import { getImageRatio } from '@/utils/utils'
import { ScrollView } from '@tarojs/components'
import classNames from 'classnames'
import { CSSProperties, FunctionComponent, PureComponent, ReactNode } from 'react'
import { LoadMore } from '../LoadMore'
import { BaseMasonryItemModel, MASONRY_ITEM_WIDTH } from './types'

export type MasonryProps<T extends BaseMasonryItemModel> = {
  style?: CSSProperties
  className?: string

  /**
   * 列表重新刷新中
   */
  reLoading: boolean

  /**
   * 列表加载更多中
   */
  loadingMore: boolean

  /**
   * 是否可以继续加载更多
   */
  noMore: boolean

  /**
   * 瀑布流原始数组
   */
  data: T[]

  /**
   * 单个瀑布流项的非图片高度，单位rpx
   * @description 用于协助计算瀑布流（包括上下margin）
   */
  itemHeight: number

  /**
   * 加载更多
   */
  onLoadMore: Function

  /**
   * 渲染单个瀑布流项
   */
  renderItem: (item: T) => JSX.Element
}

type State<T extends BaseMasonryItemModel> = {
  leftList: T[]
  rightList: T[]
}

/**
 * ! 注意此处用 scroll-view 仅为获取其触底回调能力（调试样式真的麻烦）
 * 瀑布流
 */
export class Masonry<T extends BaseMasonryItemModel> extends PureComponent<MasonryProps<T>, State<T>> {
  readonly state: State<T> = {
    leftList: [],
    rightList: [],
  }

  // 左列高度(rpx)
  private leftH = 0
  // 右列高度(rpx)
  private rightH = 0
  // 从原始列表第几下标开始(用于快速分页)
  private flagIndex = 0

  get loading() {
    const loading = this.props.reLoading || this.props.loadingMore
    return loading
  }

  render(): ReactNode {
    const { leftList, rightList } = this.state
    const { style, className, noMore, onLoadMore, renderItem } = this.props

    return (
      <ScrollView
        scrollY
        scrollX={false}
        style={style}
        className={classNames('relative z-0 h-full max-h-full w-full', className)}
        onScrollToLower={this.onReachBottom}
      >
        <div className='flex w-full flex-row justify-between p-3'>
          <ol className='w-1/2 pr-1.5'>
            {leftList.map((item) => renderItem(item))}
            {this.loading && <LeftLoading />}
          </ol>
          <ol className='w-1/2 pl-1.5'>
            {rightList.map((item) => renderItem(item))}
            {this.loading && <RightLoading />}
          </ol>
        </div>
        <LoadMore loading={this.loading} noMore={noMore} onLoadMore={onLoadMore} />
      </ScrollView>
    )
  }

  componentDidMount() {
    if (this.props.data.length > 0) {
      this.handleMasonry()
    }
  }

  componentDidUpdate(prevProps: MasonryProps<T>) {
    if (
      (this.props.data.length === 0 && prevProps.data.length !== 0) || // 1.列表数据重置
      (this.props.reLoading && !prevProps.reLoading) // 2. 列表重新刷新
    ) {
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
    if (!this.loading && !this.props.noMore) {
      this.props.onLoadMore()
    }
  }

  handleMasonry = () => {
    const { itemHeight, data = [] } = this.props

    let todoLeftList: T[] = []
    let todoRightList: T[] = []

    for (let i = this.flagIndex; i < data.length; i++) {
      // 列表单项高度 = 图片展示高度 + 其它元素高度 + 间距
      const height = MASONRY_ITEM_WIDTH * getImageRatio(data[i].cover) + itemHeight

      if (this.leftH <= this.rightH) {
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
    <div className='skeleton mb-3 h-80 w-full rounded-lg'></div>
    <div className='skeleton mb-3 h-40 w-full rounded-lg'></div>
  </div>
)

const RightLoading: FunctionComponent = () => (
  <div className='w-full'>
    <div className='skeleton mb-3 h-40 w-full rounded-lg'></div>
    <div className='skeleton mb-3 h-80 w-full rounded-lg'></div>
    <div className='skeleton mb-3 h-40 w-full rounded-lg'></div>
    <div className='skeleton mb-3 h-80 w-full rounded-lg'></div>
  </div>
)
