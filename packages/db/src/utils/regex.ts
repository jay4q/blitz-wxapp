/**
 * 校验11位手机号
 * @param mobile
 */
export const testMobile = (mobile: string) => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(mobile)

/**
 * 校验护照
 * @param id
 */
export const testPassport = (id: string) =>
  /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/.test(id)

/**
 * 校验港澳通行证
 * @param id
 */
export const testHkMacPassport = (id: string) => /^[Cc][0-9a-zA-Z]\d{7}$/.test(id)

/**
 * 校验台胞证
 * @param id
 */
export const testTaiwanPassport = (id: string) => /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/.test(id)

// ---

const getValidateCode = (idcard: string) => {
  const coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const idBaseCode = idcard.substring(0, 17)
  const weight = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]

  let totalSum = 0
  for (let i = 0; i < idBaseCode.length; i++) {
    totalSum += Number(idBaseCode[i]) * coefficient[i]
  }

  const mod = totalSum % 11
  return weight[mod]
}

/**
 * 校验18位身份证
 * @param idcard
 */
export const testChinaId = (idcard: string) => {
  // 初步校验是否是二代身份证
  const idRegex = /^[1-9]{1}[0-9]{3}[0-9]{2}(19|20)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9xX]{4}/
  if (!idRegex.test(idcard)) {
    return false
  }

  // 校验验证码
  const lastCode = idcard.substring(17, 18).toUpperCase()
  const rightCode = getValidateCode(idcard.toUpperCase())
  return lastCode === String(rightCode)
}
