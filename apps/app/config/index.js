const path = require('path')
const { UnifiedWebpackPluginV5 } = require('weapp-tailwindcss-webpack-plugin')

const { appEnv } = require('./env')
const { relativePathAlias } = require('./relativePath')

const config = {
  env: appEnv, // ! 使用自定义的环境变量
  projectName: 'app',
  date: '2021-07-16',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  compiler: {
    type: 'webpack5',
    // 仅 webpack5 支持依赖预编译配置
    prebundle: {
      enable: false,
    },
  },
  cache: {
    enable: false, // ! 配合 tailwindcss 使用时应该关闭
  },
  alias: relativePathAlias,
  sourceRoot: 'src',
  outputRoot: '../../wxapp-dist/client',
  plugins: ['@tarojs/plugin-html'],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'preact',
  mini: {
    runtime: {
      enableInnerHTML: false,
    },
    webpackChain(chain, webpack) {
      // 注册tailwindcss
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [
              {
                appType: 'taro',
              },
            ],
          },
        },
      })
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      // @see https://github.com/sonofmagic/weapp-tailwindcss-webpack-plugin/issues/155
      // 设置成 false 表示 不去除 * 相关的选择器区块
      // 假如开启这个配置，它会把 tailwindcss 整个 css var 的区域块直接去除掉
      // 需要用 config 套一层，官方文档上是错的
      htmltransform: {
        enable: false,
        config: {
          removeCursorStyle: true,
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {},
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
