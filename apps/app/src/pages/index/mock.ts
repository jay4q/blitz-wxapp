import { MasonryItemModel } from '@/components/Masonry'
import { wait } from '@/utils/utils'
import { IPagingResp, IResponse } from 'db'

const mockData: MasonryItemModel[] = [
  {
    _id: '1',
    title: '藏品1',
    cover:
      'https://6d75-museum-1g8w6o4l75c810d8-1306317407.tcb.qcloud.la/admin-uploads/e4ddbb3662578ff70058c49e60a3ea88/2022-04-29/2b196e1ec9034779a4901bb14e181a15.JPG?color=%23c89071&hash=UCJt%40goyEMxa-%3DRlaekB%5E%2CE1kTNG~WWVt6%24%2A&height=4341&width=2525',
  },
  {
    _id: '2',
    title: '藏品2',
    cover:
      'https://6d75-museum-1g8w6o4l75c810d8-1306317407.tcb.qcloud.la/admin-uploads/e4ddbb3662578ff70058c49e60a3ea88/2022-04-29/ab85cfd2e35b47bbbeda7740d227dd31.JPG?color=%23e45b24&hash=UlQ0Huof~qRjxufQRjWBt7t7WBRjxuRjRjxu&height=4134&width=2818',
  },
  {
    _id: '3',
    title: '快点减肥咖啡的客服即可交罚款的客服金额看风景的巅峰丰富的饭',
    cover:
      'https://6d75-museum-1g8w6o4l75c810d8-1306317407.tcb.qcloud.la/admin-uploads/e4ddbb3662578ff70058c49e60a3ea88/2022-04-29/5f982e8112ee40fa8654095f5bd9b398.jpg?color=%23b6852b&hash=U8FhCf%3Fat3jq_L-%3BNHM%7Cx%5D%3Ft%24iR%2A.7tRs%3AIV&height=3543&width=2657',
  },
  {
    _id: '4',
    title: '藏品4',
    cover:
      'https://6d75-museum-1g8w6o4l75c810d8-1306317407.tcb.qcloud.la/admin-uploads/e4ddbb3662578ff70058c49e60a3ea88/2022-04-29/b56dbc51766d41fbbae983d4ffb3018a.JPG?color=%2393806b&hash=UCKUJ_~pWAWExuxuMxV%40oJM%7BM%7Bt7IUogj%5Bt7&height=2233&width=1679',
  },
  {
    _id: '5',
    title: '藏品5',
    cover:
      'https://6d75-museum-1g8w6o4l75c810d8-1306317407.tcb.qcloud.la/admin-uploads/e4ddbb3662578ff70058c49e60a3ea88/2022-04-29/21d6dabdb7db4cdc8c9a2f1fd682ed43.JPG?color=%23e2b03e&hash=UFNJ8q4oW.x%5D%3FSiwxubH%3F%5BNKjDnirV%25gt7t7&height=1600&width=1498',
  },
  {
    _id: '6',
    title: '藏品6',
    cover:
      'https://6d75-museum-1g8w6o4l75c810d8-1306317407.tcb.qcloud.la/admin-uploads/e4ddbb3662578ff70058c49e60a3ea88/2022-04-29/6271f72f75e04ad1b458c763749c5421.JPG?color=%23b19b5a&hash=U8G9Nb2.KNrdtEKOtQrsx%2A%23BWGtQ%7CqNMWFS%7C&height=4513&width=2017',
  },
]

export const mockApi = async (current: number): Promise<IResponse<IPagingResp<MasonryItemModel>>> => {
  await wait(2000)

  if (current > 2) {
    return {
      code: 200,
      message: 'OK',
      data: { total: 12, list: [] },
    }
  }

  return {
    code: 200,
    message: 'OK',
    data: {
      total: 12,
      list: mockData.map((item) => ({ ...item, _id: current + item._id })),
    },
  }
}
