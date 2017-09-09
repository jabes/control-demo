'use strict';

const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');

class Middleware {

  constructor(server) {

    this.server = server;

    this.webpackConfig = require('../webpack.config');
    this.webpackCompiler = new Webpack(this.webpackConfig);

    this.devMiddleware = WebpackDevMiddleware(this.webpackCompiler, {
      noInfo: true, // display no info to console (only warnings and errors)
      quiet: true, // display nothing to the console
      publicPath: this.webpackConfig.output.publicPath,
      stats: {colors: true},
      // switch into lazy mode
      // that means no watching, but recompilation on every request
      lazy: false,
      watchOptions: {
        aggregateTimeout: 300,
        poll: true,
      },
    });

    this.hotMiddleware = WebpackHotMiddleware(this.webpackCompiler, {
      noInfo: true, // disable informational console logging
      quiet: true, // disable all console logging
      reload: true, // auto-reload the page when webpack gets stuck
    });

  }

  extendServerRequests() {

    this.server.ext('onRequest', (request, reply) => {
      const {req, res} = request.raw;
      this.devMiddleware(req, res, error => {
        if (error) return reply(error);
        reply.continue();
      });
    });

    this.server.ext('onRequest', (request, reply) => {
      const {req, res} = request.raw;
      this.hotMiddleware(req, res, error => {
        if (error) return reply(error);
        reply.continue();
      });
    });

  }

}

module.exports = Middleware;
