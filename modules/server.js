'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const env = process.env.NODE_ENV;
const ssl = process.env.ENABLE_SSL;

class Server {

  constructor() {
    this.server = new Hapi.Server();

    this.config = {
      host: "localhost",
      address: "0.0.0.0",
      port: 8000,
    };

    if (ssl === 'true') {
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
    if (env !== 'production') {
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
