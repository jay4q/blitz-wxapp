const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { appEnv } = require('./env')

const config = {
  env: appEnv, // ! 使用自定义的环境变量
  projectName: 'album',
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
  sourceRoot: 'src',
  outputRoot: '../../wxapp-dist/client',
  plugins: [
    '@tarojs/plugin-html',
    [
      '@dcasia/mini-program-tailwind-webpack-plugin/dist/taro',
      {
        enableRpx: true,
        enableDebugLog: process.env.NODE_ENV === 'development' ? false : true,
      },
    ],
  ],
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
    /**
     * @see https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans
     */
    webpackChain(chain, webpack) {
      // 支持绝对路径
      chain.resolve.plugin('tsConfigPath').use(TsconfigPathsPlugin)
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
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
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
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
