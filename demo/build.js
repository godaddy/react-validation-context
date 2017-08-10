/* eslint-disable no-console */

const path = require('path');
const process = require('process');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ProgressBar = require('progress');

const webpackCompiler = webpack(function getWebpackConfig(action) {
  switch (action) {
    case 'live':
      return require('./webpack.config.live.js');
    default:
      return require('./webpack.config.js');
  }
}(process.argv[2]));

const webpackBuildFinished = (err, stats) => {
  if (err) {
    console.log('\n\n===== WEBPACK BUILD FAILED =====');
    throw err;
  } else {
    console.log('\n\n===== WEBPACK BUILD FINISHED =====');
    console.log(stats.toString({
      colors: true,
      timings: true,
      cached: false
    }));
  }
};

const webpackProgress = new ProgressBar(
  '[:bar] :percent eta :etas  :msg', {
    total: 100, complete: '=', incomplete: ' ', width: 10
  }
);

webpackCompiler.apply(new ProgressPlugin((percent, msg) => {
  webpackProgress.update(percent, { msg });
}));

switch (process.argv[2]) {
  case 'watch':
    webpackCompiler.watch({}, webpackBuildFinished);
    break;
  case 'live': {
    const WebpackDevServer = require('webpack-dev-server');
    const server = new WebpackDevServer(webpackCompiler, {
      contentBase: [
        path.join(__dirname, 'dist'),
        path.join(__dirname, 'public')
      ],
      hot: true,
      compress: true,
      historyApiFallback: true,
      stats: { colors: true, timings: true, cached: false }
    });
    server.listen(8080, 'localhost');
    break;
  }
  default:
    webpackCompiler.run(webpackBuildFinished);
}

