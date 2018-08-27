const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    // 开发环境
    development: {
      extraBabelPlugins: ['dva-hmr'],
      publicPath: '/',
    },
    // 打包时各个文件指向的路径
    production: {
      publicPath: process.env.SPACE_API_URL,
    }
  },
  outputPath: `./home/`,
  externals: {
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  proxy: {
    '/space': {
      target: process.env.SPACE_PROXY_URL, // 本地运行时启用代理访问的路由
      changeOrigin: true,
      pathRewrite: { '^/space': '' },
    },
  },
  // true：关闭懒加载
  // false：懒加载每一个页面（打包时每个页面打包为一个 js 文件，进入该页面才会加载此 js 文件）
  disableDynamicImport: false,
  hash: true,
};
