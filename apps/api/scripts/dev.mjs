import { config } from 'dotenv'
import * as path from 'path'

const envFile = '.env.dev'
const rootDir = '../../wxapp-dist/functions'

const env = config({
  path: path.resolve(process.cwd(), envFile),
})

if (!env.error) {
  const funcName = env.parsed.TCB_FUNC_NAME

  if (funcName) {
    const targetDir = `${rootDir}/${funcName}`

    await $`rm -rf ${targetDir}`
    await $`mkdir -p ${targetDir}`
    console.log('🎉🎉🎉成功清理历史文件')
    await $`cp ${envFile} ${targetDir}`
    console.log('🎉🎉🎉文件结构梳理完毕')
    await $`ncc build index.ts --watch --out ${targetDir}`
    console.log(chalk.green('🎉🎉🎉成功启动云函数'))
  } else {
    console.log(chalk.red(`请检查 ${envFile} 内的变量是否填写完整`))
  }
} else {
  console.log(chalk.red('😭😭😭云函数开发启动失败'))
}
