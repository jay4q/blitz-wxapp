export interface BaseMasonryItemModel {
  /**
   * 瀑布流项目必须展示图片，毕竟以图为主
   */
  cover?: string
}

/**
 * 瀑布流项目的宽度
 */
export const MASONRY_ITEM_WIDTH = (750 - 12 * 3) / 2
