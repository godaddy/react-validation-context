const config = require('./webpack.config.base.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

if (!config.module) {
  config.module = {};
}

if (!config.module.rules) {
  config.module.rules = [];
}

config.module.rules.push(
  {
    test: /\.js$/,
    enforce: 'pre',
    exclude: /node_modules/,
    use: ['eslint-loader']
  }
);

if (!config.performance) {
  config.performance = {};
}

config.performance.hints = false;

if (!config.plugins) {
  config.plugins = [];
}

config.plugins.push(
  new CleanWebpackPlugin(['dist'], { verbose: true })
);

module.exports = config;

