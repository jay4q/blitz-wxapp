import { Masonry } from '@/components/Masonry'
import { useInfiniteScroll } from 'ahooks'
import { FunctionComponent } from 'react'
import { mockApi } from './mock'

const pageSize = 6

// 首页
const Index: FunctionComponent = () => {
  const { data, loading, loadingMore, loadMore, noMore } = useInfiniteScroll(
    async (d) => {
      const current = Math.ceil((d?.list.length || 0) / pageSize)
      const resp = await mockApi(current)
      return {
        list: resp.data?.list || [],
        total: Number(resp.data?.total || d?.total || 0),
      }
    },
    {
      isNoMore: (d) => (d?.list.length || 0) >= Number(d?.total || 0),
    }
  )

  const list = data?.list || []

  return (
    <>
      <Masonry data={list} noMore={noMore} loading={loading || loadingMore} onLoadMore={loadMore} />
    </>
  )
}

export default Index
