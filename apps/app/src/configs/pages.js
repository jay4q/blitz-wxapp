// 脚本自动生成代码，请勿随意调整

const paths = {
  // insert
  index: '/pages/index/index',
  audio: '/pages/audio/index',
  user__editor: '/pages/user/editor/index',
}

const pages = Object.values(paths).map((p) => p.substring(1))

module.exports = {
  pages,
  paths,
}
