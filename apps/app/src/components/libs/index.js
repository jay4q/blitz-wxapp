const { useGlobalIconFont } = require('./iconfont/helper')

const nativeComponentList = {
  ...useGlobalIconFont(), // iconfont
  'mp-html': 'components/libs/mp-weixin/index', // 富文本渲染
}

module.exports = {
  nativeComponentList,
}

// https://jin-yufeng.gitee.io/mp-html/#/basic/prop
