const CompressionWebpackPlugin = require('compression-webpack-plugin')

process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')

module.exports = {
  productionSourceMap: false,
  transpileDependencies: ['ele-admin-pro'],
  chainWebpack: config => {
    // 忽略wx自定义标签
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          isCustomElement: tag => tag.startsWith('wx-')
        }
        return options
      })

    // 删除默认的splitChunk
    // 多入口不会打包共用依赖（因为不存在公用依赖的环境）
    config.optimization.delete('splitChunks')

    //忽略/moment/locale下的所有文件
    // config.plugin('ignore')
    //   .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

    config.plugins.delete('prefetch')
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境进行gzip压缩
      config.plugin('compression-webpack-plugin').use(
        new CompressionWebpackPlugin({
          test: /\.(js|css|html)$/,
          threshold: 10240
        })
      )
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
}
