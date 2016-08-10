/* eslint-env node */

const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ctxDir = path.resolve(__dirname);
const srcDir = path.resolve(__dirname, 'src');
const outDir = path.resolve(__dirname, 'dist');

module.exports = {
  devtool: 'cheap-module-source-map',
  debug: true,
  context: ctxDir,
  entry: {
    main: [srcDir],
    app: [path.resolve(srcDir, 'app')]
  },
  output: {
    path: outDir,
    publicPath: '/',
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[hash].chunk.js'
  },
  resolve: {
    root: [srcDir],
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules'],
    fallback: [path.resolve(ctxDir, 'node_modules')]
  },
  resolveLoader: {
    root: path.resolve(ctxDir, 'node_modules')
  },
  postcss: () => [autoprefixer],
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: [
        'style',
        'css'
        + '?modules'
        + '&localIdentName=[local]-[hash:base64:5]'
        + '&importLoaders=1',
        'postcss'
      ]
    }, {
      test: /\.less$/,
      loaders: [
        'style',
        'css'
        + '?modules'
        + '&localIdentName=[local]-[hash:base64:5]'
        + '&importLoaders=2',
        'postcss',
        'less'
      ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel']
    }, {
      test: /\.(eot|woff|ttf|svg|jpg|png|ico)$/,
      loader: 'url?limit=10000&name=[path][name].[hash:base64:5].[ext]'
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('commons.[hash].js'),
    new HtmlWebpackPlugin({
      template: path.resolve(srcDir, 'index.html')
    })
  ]
};
