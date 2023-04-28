const funcName = 'wxapp-phone-api'
const envFileName = '.env.prod'
const envFileDir = '../../' + envFileName
const deployDir = 'dist'
const funcDir = deployDir + '/functions'

await $`rm -rf dist`
console.log(chalk.green('🎉🎉🎉 成功编译TS代码'))
await $`ncc build index.ts --source-map --minify --out ${funcDir}/${funcName}`
await $`cp ${envFileDir} ${deployDir}`
await $`cp ${envFileDir} ${funcDir}/${funcName}`
await $`cp cloudbaserc.json ${deployDir}`
console.log(chalk.green('🎉🎉🎉 成功缩减JS代码并输出了产线代码'))
await $`cd ${deployDir} && tcb fn deploy --mode prod ${funcName} --force`
console.log(chalk.green('🎉🎉🎉 成功部署云函数'))
