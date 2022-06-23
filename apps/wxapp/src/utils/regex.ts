export const testMobile = (mobile: string) => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(mobile)

export const testChinaId = (id: string) => /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/.test(id)

export const testPassport = (id: string) => /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/.test(id)

export const testHkMacPassport = (id: string) => /^[Cc][0-9a-zA-Z]\d{7}$/.test(id)

export const testTaiwanPassport = (id: string) => /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/.test(id) 