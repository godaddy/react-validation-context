/* eslint-env node */
/* eslint no-console: "off" */
/* eslint strict: "off" */

'use strict';

const process = require('process');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ProgressBar = require('progress');

const production = process.argv[2] === 'production';
const webpackConfig = require(production ? './webpack.config.production.js' : './webpack.config.js');

const webpackBuildFinished = (err, stats) => {
  if (err) {
    console.log("\n\n===== WEBPACK BUILD FAILED =====");
    throw err;
  } else {
    console.log("\n\n===== WEBPACK BUILD FINISHED =====");
    console.log(stats.toString({ colors: true, timings: true, cached: false }));
  }
};

function webpackCompiler() {
  const compiler = webpack(webpackConfig);
  const webpackProgress = new ProgressBar(
    '[:bar] :percent eta :etas  :msg', {
      total: 100, complete: '=', incomplete: ' ', width: 10
    }
  );

  let webpackPrevPercent = 0;
  compiler.apply(new ProgressPlugin((percent, msg) => {
    webpackProgress.tick((percent - webpackPrevPercent) * 100, { 'msg': msg });
    webpackPrevPercent = percent;
  }));

  return compiler;
}

if (process.argv[2] === 'watch') {
  webpackCompiler().watch({}, webpackBuildFinished);
  return;
} else if (process.argv[2] === 'live') {
  const app = require('express')();
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  Object.keys(webpackConfig.entry).forEach(function entries(key) {
    webpackConfig.entry[key].push('webpack-hot-middleware/client');
  });
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.module.loaders.forEach(function loaders(loader) {
    if (loader.loaders && loader.loaders[0] === 'babel') {
      loader.loaders.unshift('react-hot');
    } else if (loader.loader === 'babel') {
      loader.loader = ['react-hot', 'babel'];
    }
  });

  const compiler = webpackCompiler();

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true, timings: true, cached: false }
  }));

  app.use(webpackHotMiddleware(compiler));

  app.listen(8080);
  return;
}

webpackCompiler().run(webpackBuildFinished);

