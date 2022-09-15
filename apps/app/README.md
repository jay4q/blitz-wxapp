# 微信小程序

基于 `Taro/React/Typescript` 并依赖腾讯云开发的微信小程序脚手架

## 💻 准备工作

> 请先仔细阅读根目录 README.md 文档

### 环境变量

1. 详见项目更目录的 `.env.example` 并仔细阅读根目录的 `README.md` 中配置环境变量一章
2. 若有自定义特殊的环境变量，直接添加即可。建议使用 `WXAPP_PUBLIC_` 作为前缀变量名，好区分

### 更新 Iconfont

1. 仔细阅读 [taro-iconfont-cli](https://github.com/iconfont-cli/taro-iconfont-cli) 文档
   1. 图标前缀默认为 `icon-`，如果有调整，请同时调整 `iconfont.json` 文件（建议不要做命名上的调整）
   2. 建议使用增量更新，不要随意删除或者重命名图标
2. 当有新图标上传，登录 [官网](https://www.iconfont.cn/) 获取最新链接，修改 `iconfont.json` 中的 `symbol_url` 参数
3. 执行 `yarn g:icon` 更新图标

### 更新主题色

1. 主题色是根据 [antd 算法](https://ant.design/docs/spec/colors-cn#%E8%89%B2%E6%9D%BF%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7) 生成
2. 若需要改变主题色，将根据上述网址生成的主题色，替换掉 `tailwindcss.config.js` 中的 `theme.extend.colors.primary` 配置；同时，更新 `./src/configs/const.ts` 中 `constConfig.colors` 配置

## 👷 常用脚本/操作

```bash
# 创建页面组件
yarn g:page path/to/new-page [页面标题]

# 更新图标库
yarn g:icon
```

> 注意：若更新图标失败，请进入 `kzl-wxapp/node_modules/taro-iconfont-cli/commands/index.js` 将 `var miniProgramBasePath = 'node_modules/mini-program-iconfont-cli'` 调整为 `var miniProgramBasePath = '../../node_modules/mini-program-iconfont-cli'` 即可

### 更新 Taro

> 建议不要频繁更新，特别是最新版本。建议待官方发布下一版后，再升级次新版本

1. 删除 node_modules 和 yarn.lock
2. 在 package.json 中，根据当前 @tarojs/taro 的版本号在当前文件全局查询，并替换为 [release 官网](https://github.com/NervJS/taro/releases) 的最稳定版本号
3. 执行 `yarn` 重新安装依赖
4. 验证项目是否正常运行（一般大版本更新会产生不少问题）

## 🤔️ 注意事项和要求

1. 注意：使用了 preact 替代 react。测试下来，dev 模式节省 100kb，prod 模式节省 80+kb（节省的目的是加速小程序下载）
2. 要求：统一使用 [Ant Design 色彩](https://ant.design/docs/spec/colors-cn) 用于系统主色。需要在 `tailwind.config.js` 以及 `src/configs/const.ts` 中定义

## 参考

- [支持 preact](https://docs.taro.zone/blog/2021-11-24-Taro-3.4-beta#%E6%94%AF%E6%8C%81%E4%BD%BF%E7%94%A8-preact)
- [taro 如何配置多份环境变量](https://github.com/NervJS/taro/issues/9838#issuecomment-1153659955)
- [支持 windicss](https://github.com/dcasia/mini-program-tailwind)

## Todo

- [ ] upd: 🤔 富文本渲染考虑使用自定义组件（特别是图片，支持自定义图片组件）

### 2022.09.05

- [x] feat: 🚀 使用 preact 替换 react
- [x] add: 🧱 富文本渲染工具

### 2022.09.02

- [x] feat: 🎨 完成类小红书的瀑布流

### 2022.08.31 前

- [x] feat: 🎨 引入图片优化组件
- [x] feat: 🎨 引入 windicss
- [x] upd: 💅 全量使用 windicss 并移除对 css modules 的支持
- [x] upd: 💅 将 css variables 替换为 windicss 配置
- [x] fix: 🐛 windicss 使用 classnames 时，无法出现静态提示。考虑下是否可以改成 tailwindcss 配置解决问题
