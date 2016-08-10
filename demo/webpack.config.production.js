/* eslint-env node */

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./webpack.config.base.js');

config.debug = false;

if (!config.module) {
  config.module = {};
}

// Use ExtractTextPlugin on any loader that uses style-loader
if (config.module.loaders) {
  config.module.loaders.forEach(function extract(l) {
    if (l.loader === 'style') {
      l.loader = ExtractTextPlugin.extract('style');
      delete l.loaders;
    } else if (l.loaders && l.loaders[0] === 'style')  {
      l.loader = ExtractTextPlugin.extract('style', l.loaders.slice(1));
      delete l.loaders;
    }
  });
}

if (!config.resolve) {
  config.resolve = {};
}

if (!config.resolve.alias) {
  config.resolve.alias = {}
}

config.resolve.alias['react'] = 'react-lite';
config.resolve.alias['react-dom'] = 'react-lite';

if (!config.plugins) {
  config.plugins = [];
}

config.plugins.unshift(
  new CleanWebpackPlugin(['dist']),
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new ExtractTextPlugin('[name].[hash].css', {allChunks: true})
);

module.exports = config;

