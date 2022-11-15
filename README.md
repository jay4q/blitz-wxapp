# 微信小程序+云开发

> 若需要搭配使用管理端，请联系开发者获取 `blitz-console` 脚手架

## 📦 工程结构

> 每个子工程包都是用 typescript 编写

- `apps/app`: 微信小程序
- `apps/api`: 模拟 RESTful 能力的微信小程序云函数
- `packages/db`: 表、表结构定义、数据传输对象定义(dto)等，还有可以放一些常用函数

## 💻 准备开发

### 创建编译目标文件夹

> 详细配置可以参考[微信小程序-项目配置文件](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)

1. 在根目录下，创建文件名为 `wxapp-dist` 的文件
2. 复制 project.config.example.json 为 project.config.json，配置必须的信息并放至 `wxapp-dist` 根目录中

### 配置环境变量

1. 复制根目录的 .env.example 为 .env.dev 和 .env.prod，分别对应本地/研线和产线环境

### 开始开发

1. 执行 `yarn dev` 即可
2. 当然也可以选择独立启动
   1. `yarn workspace api dev` 执行云函数开发
   2. `yarn workspace app dev` 执行小程序开发
   3. 需要注意的是，独立启动前，建议先执行 `yarn workspace db build` 打包一份最新的定义
3. 确认编译无误后，将小程序开发者工具指向刚创建的 `wxapp-dist` 文件
4. 在小程序开发者工具，点击右上角 详情->启用代码自动热重载，设置为关闭，否则会出现白屏问题
5. 在小程序开发者工具，右键 wxapp-dist/functions/wxapp-api -> 开启云函数本地调试，即可在本地调试云函数并让小程序连接本地云函数
   1. 若代码中包含连接云数据库的请求，首次请求可能会超时，包括热重载后的首次请求也是，目前还未找到好的解决方法
   2. 使用 `wx-server-sdk` 接入云数据库，不会导致上述问题。但是这个 sdk 定义不够全，对 typescript 用户非常不友好

## 🚀 部署

1. 执行 `yarn workspace api deploy` 将云函数部署至腾讯云
2. 发布小程序（可视化）
   1. 执行 `yarn workspace app build` 编译产线小程序
   2. 确认编译无误后，进入小程序开发者工具
   3. 点击右上角上传，发布体验版小程序（注意：不需要在开发者工具里发布云函数）
   4. 进入公众平台发布小程序

## 🤔️ 使用技巧和注意事项

api 和 app 特殊的说明，请见 `apps/*/README.md`

### 关于 Monorepo

1. 使用 `yarn workspace [work] add [libs]` 为某个特定的工程添加依赖。例如 `yarn workspace app add dayjs`。前提是需要在根目录的 `package.json` 中声明工作区 `workspaces`
2. 接上，若需要在根目录添加依赖，那需要显式声明为**非工作区**，即 `yarn add -W [libs]` 或者 `yarn add -DW [libs]`
3. 使用 yarn workspace 可以节省不少硬盘空间。例如子工程均依赖 dayjs 等相同依赖，那只需要在根目录安装一遍即可
4. 热更新 db 后，若云函数引用到了 db，云函数不会热更新，必须再触发一下云函数热更新（目前暂时没有解决方法，可能要将热更新工具升级为 tsup）

## 📚 文档

- [tsup](https://tsup.egoist.sh/)
- [ncc](https://github.com/vercel/ncc)
- [taro](https://github.com/NervJS/taro)
- [tailwindcss](https://tailwindcss.com/)
- [tailwindcss-taro-plugin](https://github.com/dcasia/mini-program-tailwind)
- [iconfont](https://www.iconfont.cn/)

## 📒 Todo

### 2022.11.15

- [x] upd: 🔧 优化图片&加载组件
- [x] add: 🔌 补充微信用户登录数据逻辑

### 2022.09.22

- [x] feat: 🚀 完成基础的音频播放组件

### 2022.08.11

- [x] feat: 🚀 将 taro 升级至 3.5+
- [x] feat: 🚀 优化部署流程
- [x] feat: 🚀 统一环境变量
