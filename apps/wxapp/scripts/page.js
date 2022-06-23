/**
 * 一键生成页面/路由组件
 * @description yarn gen:page path/to/new-page [页面说明]
 */

const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

const OVR_CONFIG = './src/configs/pages.js'

// tsx模板，可以根据业务调整
const tsxTempl = (pageName) => `import './index.css'
import { FunctionComponent } from 'react'

// ${pageName || '自动生成的页面'}
const Index: FunctionComponent = () => {
  return (
    <div>
    </div>
  )
}

export default Index`

// config模板，可以根据业务调整
const configTempl = (pageName) => `export default {
  navigationBarTitleText: '${pageName || '自动生成的页面'}',
}
`

function checkPath(relativePath) {
  if (!relativePath) {
    console.log(chalk.red('请提供页面路径'))
    process.exit(0)
  }

  try {
    const stat = fs.statSync(path.join(__dirname, '../src/pages/', relativePath))
    if (stat.isDirectory()) {
      console.log(chalk.red(`路径<${relativePath}>已存在`))
      process.exit(0)
    } else {
      return relativePath
    }
  } catch (e) {
    // 一般表示该路径不存在
    return relativePath
  }
}

const relativePath = checkPath(process.argv[2])
const pageName = process.argv[3]
const pagePath = `./src/pages/${relativePath}`

// 尝试生成页面相关文件
try {
  fs.mkdirSync(pagePath, { recursive: true })
  fs.writeFileSync(`${pagePath}/index.tsx`, tsxTempl(pageName))
  fs.writeFileSync(`${pagePath}/index.config.ts`, configTempl(pageName))
  fs.writeFileSync(`${pagePath}/index.css`, '')

  // 修改页面配置文件配置
  const pageUrl = `/pages/${relativePath}/index`
  const prevConfig = fs.readFileSync(OVR_CONFIG, 'utf8')
  if (!prevConfig.includes(pageUrl)) {
    const nextConfig = prevConfig.replace(/\/\/ insert/, `// insert\n  '${relativePath.split('/').join('__')}': '${pageUrl}',`)
    fs.writeFileSync(OVR_CONFIG, nextConfig)
  }

  console.log(chalk.green(`页面<${relativePath}>创建成功`))
  process.exit(0)
} catch (e) {
  console.log(chalk.red(`无法创建页面<${relativePath}> => `), e)
  process.exit(0)
}
