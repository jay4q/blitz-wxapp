# 微信云函数

## 本地/产线打包

均使用 [ncc](https://github.com/vercel/ncc) 打包项目。支持混淆和压缩代码，保证产线云函数相对安全

## 运维

1. 登录 [腾讯云云开发控制台](https://console.cloud.tencent.com/) 对应云环境（也可以是小程序开发者工具，根据个人习惯）
2. 进入指定云函数查看「日志」和「监控」
3. 可以根据前端响应头里的 `x-tencent-scf-request-id` 属性，在日志中定位对应请求，查看输出的结果

## 注意事项

1. 由于采用云函数作为服务端，因此微信小程序侧的请求，服务端天然地能够获取请求发起者的 unionid 和 openid。因此：
   1. 我们不强求用户显式地去登录，只有在需要昵称和头像的地方（例如邀请好友）才会显式地要求用户授权个人资料
   2. 仅当用户发起需要用户态的请求，服务端才会尝试为该用户创建一个平台上的账号
2. 暂时请勿配置 tsconfig.json 里的 paths 参数为 `*`，否则会出现 [意想不到的问题](https://github.com/egoist/tsup/issues/303)

## 开发要求和建议

- 要求：禁止同时发起多个用户态相关的请求（特别是页面初始化过程中）。这样保证前端在调用用户态相关请求时，路由中间件 `user-guard` 不会重复创建用户
  - 如果初始化时必须多个请求，可以串行执行每次一个
- 要求：禁止使用 `export default` 而是直接使用 `export` 导出模块
- 要求：修改环境变量后，要重新启动
- 建议：使用 [node-sdk](https://docs.cloudbase.net/database/introduce.html) 接入腾讯云云开发/微信云开发的数据库资源；其它微信开放服务，再用 [wx-server-sdk](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/wx-server-sdk.html) 接入。理由是 wx-server-sdk 太搓了

## 依赖

- [koa-router](https://github.com/koajs/router/blob/master/API.md)
- [云函数配置](https://docs.cloudbase.net/cli-v1/functions/configs.html)
- [云函数限制](https://cloud.tencent.com/document/product/876/47177#.E4.BA.91.E5.87.BD.E6.95.B0)
- [云数据库性能优化](https://developers.weixin.qq.com/community/business/doc/00068218a682088d17ca593c45b40d)
- [ncc](https://github.com/vercel/ncc)
