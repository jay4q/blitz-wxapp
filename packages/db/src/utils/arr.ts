/**
 * 判断是否是数组以及数组是否为空
 * @param arr
 */
export const isArrayEmpty = (arr?: any[]) => !Array.isArray(arr) || arr.length === 0
