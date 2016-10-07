const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

const debug = process.argv.indexOf('-d') >= 0 ||
    process.argv.indexOf('--debug') >= 0

module.exports = {
  cache: true,
  context: path.join(__dirname, 'src'),
  entry: {
    client: [
      'whatwg-fetch',
      'eventsource-polyfill',
      './client-client.js'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.json$/i,
        loader: 'json'
      },
      {
        test: /\.css$/i,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      },
      {
        test: /\.less$/i,
        loader: ExtractTextPlugin.extract('style', 'css!less')
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'url?limit=10000&name=img/[name].[ext]'
      }
    ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  devtool: debug ? 'eval-source-map' : 'source-map',
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: debug ? '"development"' : '"production"'
      }
    })
  ].concat(!debug ? [] : [
    new webpack.optimize.DedupePlugin()/*,
    new webpack.optimize.UglifyJsPlugin({ // doesn't support ES6 yet :(
      compress: {
        screw_ie8: true, // please don't use IE8
        unsafe: true,
        warnings: false // don't puke warnings when you drop code
      },
      mangle: {
        screw_ie8: true
      }
    })*/
  ]),
  postcss: function (webpack) {
    return [
      require('postcss-import')({
        addDependencyTo: webpack,
        path: [ 'lib' ]
      }),
      require('postcss-url')({
        url: 'rebase'
      }),
      require('postcss-cssnext')({
        browsers: [ 'last 2 versions' ]
      }),
      require('postcss-browser-reporter')(),
      require('postcss-reporter')()
    ]
  }
}
