const { readdirSync } = require('fs-extra')
const path = require('path')

const srcDirList = readdirSync(path.resolve(__dirname, '../src')).filter((dir) => !path.extname(dir) && !dir.startsWith('.'))

const relativePathAlias = {}

srcDirList.forEach((dir) => {
  relativePathAlias[`@/${dir}`] = path.resolve(__dirname, `../src/${dir}`)
})

module.exports = { relativePathAlias }
