# 微信小程序+云开发

## 📦 工程结构

> 每个子工程包都是用 typescript 编写

- `apps/app`: 微信小程序
- `apps/api`: 模拟 RESTful 能力的微信小程序云函数
- `packages/db`: 表和表结构定义

## 💻 准备开发

### 创建编译目标文件夹

> 详细配置可以参考[微信小程序-项目配置文件](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)

1. 在根目录下，创建文件名为 `wxapp-dist` 的文件
2. 复制 project.config.example.json 为 project.config.json，配置必须的信息并放至 `wxapp-dist` 根目录中

### 配置环境变量

> 注：目前需要分开配置，后面可以考虑合并一下

1. 需要同时配置 `apps/app` 和 `apps/api` 的环境变量
2. 进入 `apps/app`，复制 .env.example 为 .env.dev 和 .env.prod，分别对应本地/研线和产线环境
3. 同理 `apps/api`

### 开始开发

1. 执行 `yarn dev` 即可
2. 确认编译无误后，将小程序开发者工具指向刚创建的 `wxapp-dist` 文件
3. 在小程序开发者工具，右键 wxapp-dist/functions/wxapp-api -> 开启云函数本地调试，即可在本地调试云函数并让小程序连接本地云函数
   1. 若代码中包含连接云数据库的请求，首次请求可能会超时，包括热重载后的首次请求也是，目前还未找到好的解决方法
   2. 使用 `wx-server-sdk` 接入云数据库，不会导致上述问题。但是这个 sdk 定义不够全，对 typescript 用户非常不友好

## 🤔️ 使用技巧

1. 使用 `yarn workspace [work] add [libs]` 为某个特定的工程添加依赖。例如 `yarn workspace app add dayjs`。前提是需要在根目录的 `package.json` 中声明工作区 `workspaces`
2. 接上，若需要在根目录添加依赖，那需要显式声明为**非工作区**，即 `yarn add -W [libs]` 或者 `yarn add -DW [libs]`
3. 使用 yarn workspace 可以节省不少硬盘空间。例如子工程均依赖 dayjs 等相同依赖，那只需要在根目录安装一遍即可

## 📒 Todo

- [ ] 测试云函数上线是否可用
- [ ] 部署脚本单独列出
- [ ] 环境变量合并
- [ ] 数据库表和表定义的子工程
