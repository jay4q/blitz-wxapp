// 云函数入口
export const main = async (event: any) => {
  try {
    const phoneNumber = event.encodePhoneNumber.data.phoneNumber
    return {
      code: 200,
      message: 'OK',
      data: phoneNumber,
    }
  } catch (err) {
    return {
      code: 500,
      message: '无法处理的响应',
    }
  }
}
