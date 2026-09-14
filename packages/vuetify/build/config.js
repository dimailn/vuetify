const webpack = require('webpack')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const base = require('./webpack.prod.config')
const version = process.env.VERSION || require('../package.json').version

const builds = {
  development: {
    config: {
      devtool: 'source-map',
      mode: 'development',
      output: {
        filename: 'vuetify.js',
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: 'vuetify.css',
        }),
      ],
    },
  },
  production: {
    config: {
      mode: 'production',
      output: {
        filename: 'vuetify.min.js',
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: 'vuetify.min.css',
        }),
      ],
      performance: {
        hints: false,
      },
    },
    env: 'production',
  },
}

function genConfig (opts) {
  const config = merge(base, opts.config)

  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(opts.env || 'development'),
    }),
  ])

  if (opts.env) {
    config.plugins = config.plugins.concat([
      new webpack.BannerPlugin({
        banner: `/*!
* Vuetify v${version}
* Forged by John Leider
* Released under the MIT License.
*/     `,
        raw: true,
        entryOnly: true,
      }),
    ])
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: ['default', {
              discardComments: { removeAll: true },
              zindex: false,
              reduceIdents: false,
            }],
          },
        }),
      ],
    }
  }

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(builds[process.env.TARGET])
} else {
  module.exports = Object.keys(builds).map(name => genConfig(builds[name]))
}
