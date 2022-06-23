/**
 * 快速生成组件脚本
 * @description yarn gen:comp a/b/Component [可选代码注释]
 */

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

// tsx 模版
const tsxTempl = (name, comment) => `import { FunctionComponent } from 'react'
 import styles from './${name}.module.css'
 
 type Props = {}
 
 /**
  * ${comment || '自动生成的组件'}
  */
 export const ${name}: FunctionComponent<Props> = () => {
   return (
     <div className={styles.container}>
     </div>
   )
 }`

// css 模版
const cssTempl = `.container {
 
 }`

function checkPath(relativePath) {
  if (!relativePath) {
    console.log(chalk.red('请提供组件路径'))
    process.exit(0)
  }

  try {
    const stat = fs.statSync(path.join(__dirname, '../src/components/', dir))
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
const comment = process.argv[3]
const paths = relativePath.split('/')
const filename = paths[paths.length - 1]

// 尝试生成组件相关文件
try {
  // 生成目录
  fs.mkdirSync(`./src/components/${relativePath}`, { recursive: true })
  // 生成 tsx
  fs.writeFileSync(`./src/components/${relativePath}/index.tsx`, tsxTempl(filename, comment))
  // 生成 module.css
  fs.writeFileSync(`./src/components/${relativePath}/${filename}.module.css`, cssTempl)

  console.log(chalk.green(`组件<${filename}>创建成功`))
  process.exit(0)
} catch (e) {
  console.log(chalk.red(`无法创建组件<${relativePath}> => `), e)
  process.exit(0)
}
