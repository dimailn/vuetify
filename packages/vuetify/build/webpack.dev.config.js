const path = require('path')
const { merge } = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const { config: baseWebpackConfig } = require('./webpack.base.config')

// Helpers
const resolve = file => path.resolve(__dirname, file)

module.exports = merge(baseWebpackConfig, {
  devtool: 'source-map',
  entry: ['babel-polyfill', './dev/index.js'],
  output: {
    filename: '[name].js',
    path: resolve('../dev'),
    publicPath: '/dev/',
    library: 'Vuetify',
  },
  resolve: {
    alias: {
      vuetify: resolve('../src'),
      vue$:  'vue/dist/vue.runtime.esm-browser.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {},
        },
      },
      {
        test: /\.ts$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 10000 },
        },
        generator: {
          filename: 'img/[name].[contenthash:7][ext]',
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: resolve('../dev'),
      publicPath: '/dev/',
    },
    devMiddleware: {
      publicPath: '/dev/',
    },
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || '8080',
    allowedHosts: 'all',
  },
  plugins: [
    new VueLoaderPlugin(),
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
