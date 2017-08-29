'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const env = process.env.NODE_ENV;

class Server {

  constructor() {
    this.config = require('../config');
    this.server = new Hapi.Server();
  }

  connect() {
    console.log('Creating server connection..');
    this.server.connection(this.config.hapi);
  }

  register() {

    console.log('Providing static file and directory handlers..');
    this.server.register(Inert, (err) => {
      if (err) throw err;
    });

    console.log('Defining server routes..');
    this.server.route(
      require('./routes')
    );

  }

  extend() {
    if (env !== 'production') {
      const Middleware = require('./middleware');
      const m = new Middleware(this.server);
      m.extendServerRequests();
    }
  }

  start() {
    console.log('Starting server..');
    this.server.start((err) => {
      if (err) throw err;
      console.log('Server running at:', this.server.info.uri);
    });
  }

}

module.exports = Server;
