const { config } = require('dotenv')
const path = require('path')

const envFile = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod'

const env = config({
  path: path.resolve(process.cwd(), '../../', envFile),
})

const parsedEnv = env?.parsed || {}
const appEnv = Object.entries(parsedEnv).reduce((r, [key, value]) => ({ ...r, [key]: JSON.stringify(value) }), {})

module.exports = {
  appEnv,
}
