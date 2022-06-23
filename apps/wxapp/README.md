# 微信小程序

基于 `Taro | React | Typescript` 并依赖腾讯云开发的微信小程序脚手架

## 准备

> 准备一次即可，不需要重复

1. 在当前项目所属根目录下，准备对应的**云函数**工程，需要配合云函数才能进行开发
2. 在当前项目所属根目录下，创建文件名为 `wxapp-dist/functions` 的文件
3. 复制 `project.config.example.json` 为 `project.config.json` 并配置必须的信息，例如 `appid`，并拷贝至 `wxapp-dist` 中
4. 准备环境变量
5. 首次执行完成 `yarn dev` 后（确认编译无误），将小程序开发者工具指向刚创建的 `wxapp-dist` 文件，进行开发

### 环境变量

1. 复制 `.env.example` 为 `.env.dev` 并根据需求填写对应的环境变量（均必填）
2. 若有自定义特殊的环境变量，直接添加即可（建议使用 `TARO_PUBLIC_` 变量名为前缀，好区分）

## 开发

1. 执行 `yarn dev` 开始开发
2. 将小程序开发者工具指向该项目所属根目录下的 `wxapp-dist` 文件

## 发布

1. 复制 `.env.example` 为 `.env.prod` 并根据需求填写对应的环境变量（均必填）
2. 若有自定义特殊的环境变量，直接添加即可（建议使用 `TARO_PUBLIC_` 变量名为前缀，好区分）
3. 执行 `yarn build` 打包小程序
4. 进入小程序开发者工具进行发布

## 常用脚本

```bash
# 创建页面组件
yarn gen:page path/to/new-page [页面标题]

# 创建组件
yarn gen:comp path/to/MyComponent [组件说明]
```

### 更新 Taro

> 建议不要频繁更新；特别是最新版本，建议待官方发布下一个大版本后，再升级

1. 删除 `./node_modules` & `./yarn.lock`
2. 在 `./package.json` 中，根据当前 `@tarojs/taro` 版本号在当前文件全局查询，并替换为 [release 官网](https://github.com/NervJS/taro/releases) 的最稳定版本号
3. 执行 `yarn` 重新安装依赖
4. 验证项目是否正常运行（一般大版本更新会产生不少问题）

### 更新 Iconfont

1. 仔细阅读 [taro-iconfont-cli](https://github.com/iconfont-cli/taro-iconfont-cli) 文档
   1. 图标前缀默认为`icon-`，如果有调整，请同时调整`iconfont.json` 文件（建议不要做命名上的调整）
   2. 建议使用增量更新，不要随意删除或者重命名图标
2. 当有新图标上传，登录 [官网](https://www.iconfont.cn/) 获取最新链接，修改`iconfont.json`中的`symbol_url`参数
3. 执行 `yarn gen:icon` 更新图标

## 注意事项和要求

1. 注意：不要使用 preact，暂时无法兼容 windicss，会出现 `Unsupported framework type` 问题
2. 要求：使用【CSS 变量】配置颜色，配置文件见 [app.css](./src/app.css)。生成算法见 [Ant Design 色彩](https://ant.design/docs/spec/colors-cn)。若需要在脚本中获取颜色，可以使用 `constConfig.colors`

## 参考

- [支持 preact](https://docs.taro.zone/blog/2021-11-24-Taro-3.4-beta#%E6%94%AF%E6%8C%81%E4%BD%BF%E7%94%A8-preact)
- [taro 如何配置多份环境变量](https://github.com/NervJS/taro/issues/9838#issuecomment-1153659955)
- [支持 windicss](https://github.com/dcasia/mini-program-tailwind)

## Todo

- [x] feat: 🎨 引入图片优化组件
- [x] feat: 🎨 引入 windicss
- [x] upd: 💅 全量使用 windicss 并移除对 css modules 的支持
- [x] upd: 💅 将 css variables 替换为 windicss 配置
- [ ] feat: 💅 引入 turborepo 管理项目
- [ ] feat: 💻 一键发布小程序
- [ ] fix: 🐛 windicss 使用 classnames 时，无法出现静态提示。考虑下是否可以改成 tailwindcss 配置解决问题
