import { config } from 'dotenv'
import * as path from 'path'

// 只读取产线环境变量
const envFile = '.env.prod'

const env = config({
  path: path.resolve(process.cwd(), envFile)
})

if (!env.error) {
  const funcName = env.parsed.TCB_FUNC_NAME

  if (funcName) {
    await $`rm -rf functions && rm -rf dist`
    await $`ttsc -P tsconfig.json`
    await $`cp index.js dist/`
    console.log(chalk.green('🎉🎉🎉 成功编译TS代码'))
    await $`ncc build ./dist/index.js -s -m -o functions/${funcName}/`
    await $`cp .env.prod functions/${funcName}/`
    console.log(chalk.green('🎉🎉🎉 成功缩减JS代码并输出了产线代码'))
    await $`tcb fn deploy --mode prod ${funcName} --force`
    console.log(chalk.green('🎉🎉🎉 成功部署云函数'))
  } else {
    console.log(chalk.red(`🤔️🤔️🤔️ 请检查 ${envFile} 内的变量是否填写完整`))
  }
} else {
  console.log(chalk.red('😭😭😭 云函数部署失败'))
}