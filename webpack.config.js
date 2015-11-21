const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const debug = process.argv.indexOf('-d') >= 0 ||
    process.argv.indexOf('--debug') >= 0

module.exports = {
  cache: true,
  context: __dirname + '/src',
  entry: {
    client: [
      'babel-polyfill',
      'whatwg-fetch',
      './client-client.js'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: [ 'es2015', 'stage-0', 'react' ],
          plugins: [
            [ 'transform-format-message', {
              generateId: 'underscored_crc32'
            } ],
            'transform-runtime'
          ]
        }
      },
      {
        test: /\.json$/i,
        loader: 'json'
      },
      {
        test: /\.css$/i,
        loader: ExtractTextPlugin.extract('style', 'css?-minimize&sourceMap!cssnext')
      },
      {
        test: /\.less$/i,
        loader: ExtractTextPlugin.extract('style', 'css?-minimize&sourceMap!less?sourceMap')
      },
      {
        test: /\.(gif|png|jpeg)$/i,
        loader: 'url?limit=10000&name=img/[name].[ext]'
      }
    ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: __dirname + '/dist',
    publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: debug ? '"development"' : '"production"'
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
  }
}
