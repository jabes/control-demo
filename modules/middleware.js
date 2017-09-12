'use strict';

const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');

module.exports = function (server) {

  const webpackConfig = require('../webpack.config');
  const webpackCompiler = new Webpack(webpackConfig);

  const DevMiddleware = WebpackDevMiddleware(webpackCompiler, {
    noInfo: true, // display no info to console (only warnings and errors)
    quiet: true, // display nothing to the console
    publicPath: webpackConfig.output.publicPath,
    stats: {colors: true},
    // switch into lazy mode
    // that means no watching, but recompilation on every request
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
    },
  });

  const HotMiddleware = WebpackHotMiddleware(webpackCompiler, {
    noInfo: true, // disable informational console logging
    quiet: true, // disable all console logging
    reload: true, // auto-reload the page when webpack gets stuck
  });

  return {

    extendServerRequests() {
      server.ext('onRequest', (request, reply) => {
        const {req, res} = request.raw;
        DevMiddleware(req, res, error => {
          if (error) return reply(error);
          reply.continue();
        });
      });
      server.ext('onRequest', (request, reply) => {
        const {req, res} = request.raw;
        HotMiddleware(req, res, error => {
          if (error) return reply(error);
          reply.continue();
        });
      });
    },

  };
};
