// https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/31#issuecomment-1024722576
const tailwind = require('prettier-plugin-tailwindcss')
const organizeImports = require('@trivago/prettier-plugin-sort-imports')

const combinedFormatter = {
  ...tailwind,
  parsers: {
    ...tailwind.parsers,
    ...Object.keys(organizeImports.parsers).reduce((acc, key) => {
      acc[key] = {
        ...tailwind.parsers[key],
        preprocess(code, options) {
          return organizeImports.parsers[key].preprocess(code, options)
        },
      }
      return acc
    }, {}),
  },
}

module.exports = {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  printWidth: 128,
  plugins: [combinedFormatter],

  importOrder: ['^@(.*)/(.*)$', '^[^(@|./)]*$', '^[./]'],
}
