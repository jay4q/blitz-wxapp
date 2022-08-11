import { constConfig } from './config'
import { init, CloudBase, Database, ICloudBaseConfig } from '@cloudbase/node-sdk'
import { config } from 'dotenv'
import path from 'path'

let _app: CloudBase
let _db: Database.Db

const env = config({
  // ! 虽然环境变量放在了 monorepo 根目录，但实际上最终编译后，输出在 api 文件根目录
  path: path.resolve(process.cwd(), constConfig.isLocal ? '.env.dev' : '.env.prod'),
})?.parsed

const tcbEnv = env?.WXAPP_PUBLIC_TCB_ENV || ''

/**
 * 获取云开发应用实例
 * @returns CloudBase
 */
export const getCloudApp = () => {
  if (!_app) {
    let config: ICloudBaseConfig = { env: tcbEnv }

    if (constConfig.isLocal) {
      config = {
        ...config,
      }
    }

    _app = init(config)
  }

  return _app
}

/**
 * 获取云开发数据库实例
 * @returns Database
 */
export const getDatabase = () => {
  if (!_db) {
    const app = getCloudApp()
    _db = app.database()
  }

  return _db
}
