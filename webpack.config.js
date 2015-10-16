const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const formatMessagePlugin = require('babel-plugin-format-message')
const translations = require('./locales')

const debug = process.argv.indexOf('-d') >= 0 ||
    process.argv.indexOf('--debug') >= 0

module.exports = Object.keys(translations).map(function(locale) {
  return {
    cache: true,
    context: __dirname + '/src',
    entry: {
      client: [
        'babel-core/polyfill',
        'whatwg-fetch',
        './client-client.js'
      ]
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/i,
          exclude: /node_modules/,
          loader: 'babel'
        },
        {
          test: /\.css$/i,
          loader: ExtractTextPlugin.extract('style', 'css?-minimize&sourceMap!cssnext')
        },
        {
          test: /\.(gif|png|jpeg)$/i,
          loader: 'url?limit=10000&name=img/[name].[ext]'
        }
      ],
    },
    output: {
      filename: '[name].' + locale + '.js',
      chunkFilename: '[name].' + locale + '.js',
      path: __dirname + '/dist',
      publicPath: '/'
    },
    plugins: [
      new ExtractTextPlugin('[name].css'),
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          NODE_ENV: debug ? '"development"' : '"production"',
          LOCALE: JSON.stringify(locale),
          LOCALE_DATA: JSON.stringify('intl/locale-data/jsonp/' + locale)
        }
      })
    ].concat(!debug ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // please don't use IE8
          unsafe: true,
          warnings: false // don't puke warnings when you drop code
        },
        mangle: {
          screw_ie8: true
        }
      })
    ]),
    cssnext: {
      browsers: [ 'last 2 versions' ],
      import: {
        path: [ 'lib' ]
      }
    },
    babel: {
      stage: 0,
      loose: 'all',
      plugins: [
        formatMessagePlugin.withOptions({
          translations: translations,
          missingTranslation: 'ignore',
          locale: locale
        })
      ]
    }
  }
})
