'use strict';

const webpackConfig = require('../webpack.config');

module.exports = [

  {
    method: 'GET',
    path: '/{path*}',
    // config: {
    //   auth: false,
    //   cache: {
    //     expiresIn: 24 * 60 * 60 * 1000,
    //     privacy: 'public',
    //   }
    // },
    handler: {
      directory: {
        path: webpackConfig.output.path,
        listing: false,
        index: true,
      }
    },
  },

];
