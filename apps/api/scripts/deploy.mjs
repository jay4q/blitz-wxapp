import { config } from 'dotenv'
import * as path from 'path'

// 只读取产线环境变量
const envFile = '.env.prod'
const deployDir = 'dist'
const funcDir = deployDir + '/functions'

const env = config({
  path: path.resolve(process.cwd(), envFile),
})

if (!env.error) {
  const funcName = env.parsed.TCB_FUNC_NAME

  if (funcName) {
    await $`rm -rf dist`
    console.log(chalk.green('🎉🎉🎉 成功编译TS代码'))
    await $`ncc build index.ts --source-map --minify --out ${funcDir}/${funcName}`
    await $`cp .env.prod ${deployDir}`
    await $`cp .env.prod ${funcDir}/${funcName}`
    await $`cp cloudbaserc.json ${deployDir}`
    console.log(chalk.green('🎉🎉🎉 成功缩减JS代码并输出了产线代码'))
    await $`cd ${deployDir} && tcb fn deploy --mode prod ${funcName} --force`
    console.log(chalk.green('🎉🎉🎉 成功部署云函数'))
  } else {
    console.log(chalk.red(`🤔️🤔️🤔️ 请检查 ${envFile} 内的变量是否填写完整`))
  }
} else {
  console.log(chalk.red('😭😭😭 云函数部署失败'))
}
