require('dotenv').config()

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const extractCSS = isProd || process.env.TARGET === 'development'

const cssLoaders = [
  // https://github.com/webpack-contrib/mini-css-extract-plugin#user-content-advanced-configuration-example
  // TODO: remove style-loader: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34
  extractCSS ? MiniCssExtractPlugin.loader : 'style-loader',
  { loader: 'css-loader', options: { sourceMap: true } },
  { loader: 'postcss-loader', options: { sourceMap: true } },
]

const sassLoaders = [
  ...cssLoaders,
  {
    loader: 'sass-loader',
    options: {
      implementation: require('sass'),
      api: 'modern',
      sourceMap: true,
      sassOptions: {
        verbose: true,
        quietDeps: false,
        silenceDeprecations: [],
        fatalDeprecations: ['legacy-js-api', 'slash-div', 'global-builtin', 'if-function', 'color-functions'],
      },
    },
  },
]

const scssLoaders = [
  ...cssLoaders,
  {
    loader: 'sass-loader',
    options: {
      implementation: require('sass'),
      api: 'modern',
      sourceMap: true,
      sassOptions: {
        verbose: true,
        quietDeps: false,
        silenceDeprecations: [],
        fatalDeprecations: ['legacy-js-api', 'slash-div', 'global-builtin', 'if-function', 'color-functions'],
      },
    },
  },
]

exports.config = {
  mode: isProd ? 'production' : 'development',
  target: 'web',
  resolve: {
    extensions: ['*', '.js', '.json', '.vue', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: sassLoaders,
      },
      {
        test: /\.scss$/,
        use: scssLoaders,
      },
    ],
  },
  plugins: [],
  performance: {
    hints: false,
  },
  stats: { children: false },
}
