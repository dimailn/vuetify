const { merge } = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { config: baseWebpackConfig } = require('./webpack.base.config')

// Helpers
const resolve = file => require('path').resolve(__dirname, file)

module.exports = merge(baseWebpackConfig, {
  entry: {
    app: './src/index.ts',
  },
  output: {
    path: resolve('../dist'),
    publicPath: '/dist/',
    library: {
      name: 'Vuetify',
      type: 'umd',
      export: 'default',
    },
    // See https://github.com/webpack/webpack/issues/6522
    globalObject: `typeof self !== 'undefined' ? self : this`,
  },
  externals: {
    vue: {
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
      root: 'Vue',
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve('../tsconfig.json'),
        diagnosticOptions: {
          syntactic: true,
          semantic: true,
        },
      },
    }),
  ],
})
