const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ctxDir = path.resolve(__dirname);
const srcDir = path.resolve(ctxDir, 'src');
const outDir = path.resolve(ctxDir, 'dist');
const publicPath = '/';

module.exports = {
  devtool: 'cheap-module-source-map',
  context: ctxDir,
  entry: {
    main: ['normalize.css', srcDir],
    lib: [
      'babel-polyfill', 'react', 'react-dom'
    ]
  },
  output: {
    path: outDir,
    publicPath,
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'react-validation-context': path.resolve(__dirname, '..'),
      'src': srcDir
    }
  },
  module: {
    rules: [{
      test: /\.css$/,
      include: [/node_modules/],
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1
        }
      }]
    }, {
      test: /\.less$/,
      include: [srcDir],
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          modules: true,
          localIdentName: '[local]-[hash:base64:5]',
          importLoaders: 2
        }
      }, {
        loader: 'less-loader',
        options: {
          sourceMap: true
        }
      }]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }]
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['lib', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
