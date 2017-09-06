'use strict';

const Hapi = require('hapi');
const Inert = require('inert');

class Server {

  constructor() {
    this.server = new Hapi.Server();

    this.config = {
      host: process.env.HAPI_HOST,
      address: process.env.HAPI_ADDRESS,
      port: process.env.PORT || process.env.HAPI_PORT,
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
    if (process.env.NODE_ENV !== 'production') {
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
