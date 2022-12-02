const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"./",
  lintOnSave: false,
  devServer:{
    port:8300,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    allowedHosts:[
      'jluyyds.ltd',
      '*.jluyyds.ltd',
    ],
    historyApiFallback: {
      index: '/'
    },
    proxy:{
      '/serve':{
        target: 'http://localhost:8301',// 后端接口
        changeOrigin: true, // 是否跨域
        secure:false,
        pathRewrite: {
          '/serve': ''
        }
      }
    }
  }
})
