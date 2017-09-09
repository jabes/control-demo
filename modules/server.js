'use strict';

const Hapi = require('hapi');
const Nes = require('nes');
const Inert = require('inert');

class Server {

  constructor() {
    this.server = new Hapi.Server();

    this.config = {
      host: process.env.HAPI_HOST,
      address: process.env.HAPI_ADDRESS,
      port: process.env.PORT,
    };

    if (process.env.ENABLE_SSL === 'true') {
      const spdy = require('spdy');
      const fs = require('fs');
      this.config.tls = true;
      this.config.autoListen = true;
      this.config.listener = spdy.createServer({
        key: fs.readFileSync('./keys/key.pem'),
        cert: fs.readFileSync('./keys/certificate.pem'),
        spdy: {
          protocols: ['h2'],
          plain: false,
        }
      });
    }
  }

  connect() {
    console.log('Creating server connection..');
    this.server.connection(this.config);
  }

  register() {
    console.log('Registering server plugins..');
    return new Promise((resolve, reject) => {
      const plugins = [Inert, Nes];
      this.server.register(plugins, err => {
        if (err) {
          console.error('Failed to load a plugin:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  route() {
    console.log('Defining server routes..');
    const routes = require('./routes');
    this.server.route(routes);
    this.server.subscription('/todo/updates');
  }

  extend() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Adding server middleware..');
      const Middleware = require('./middleware');
      const m = new Middleware(this.server);
      m.extendServerRequests();
    }
  }

  start() {
    console.log('Starting server..');
    this.server.start(err => {
      if (err) throw err;
      console.log('Server running at:', this.server.info.uri);
    });
  }

}

module.exports = Server;
