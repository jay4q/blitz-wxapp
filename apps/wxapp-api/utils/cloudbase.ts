import { constConfig } from './config'
import { init, CloudBase, Database, ICloudBaseConfig } from '@cloudbase/node-sdk'
import { config } from 'dotenv'
import path from 'path'

let _app: CloudBase
let _db: Database.Db

const env = config({
  path: path.resolve(process.cwd(), constConfig.isLocal ? '.env.dev' : '.env.prod'),
})?.parsed

export const TCB_ENVID = env?.TCB_ENVID || ''
export const TCB_SECRET_ID = env?.TCB_SECRET_ID || ''
export const TCB_SECRET_KEY = env?.TCB_SECRET_KEY || ''

/**
 * 获取云开发应用实例
 * @returns CloudBase
 */
export const getCloudApp = () => {
  if (!_app) {
    let config: ICloudBaseConfig = { env: TCB_ENVID }

    if (constConfig.isLocal) {
      config = {
        ...config,
        secretId: TCB_SECRET_ID,
        secretKey: TCB_SECRET_KEY,
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
