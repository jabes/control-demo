'use strict';

const Hapi = require('hapi');

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

  loadPlugin(name, options = {}) {
    console.log(`Loading server plugin: ${name}`);
    return new Promise((resolve, reject) => {
      this.server.register({
        register: require(name),
        options,
      }, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  setAuthStrategy() {
    console.log('Setting server auth strategy..');
    this.server.auth.strategy('jwt', 'jwt', {
      key: process.env.JWT_SECRET,
      validateFunc: (decoded, request, callback) => {
        const isValid = !!decoded;
        callback(null, isValid, decoded.user);
      },
      verifyOptions: {
        algorithms: [
          process.env.JWT_ALGORITHM
        ]
      },
    });
  }

  register() {
    console.log('Registering server plugins..');
    this.loadPlugin('inert');
    this.loadPlugin('hapi-auth-jwt2');
    this.setAuthStrategy();
    this.loadPlugin('nes', {
      auth: {
        type: 'direct',
        route: 'jwt',
      },
    });
  }

  route() {
    console.log('Defining server routes..');
    const routes = require('./routes');
    this.server.route(routes);
  }

  subscribe(database) {
    console.log('Subscribing server to socket events..');
    const filter = (path, message, options, next) => {
      const row = message.new_val || message.old_val;
      const id = row.user_id || row.id;
      return next(id === options.credentials.id);
    };
    this.server.subscription('/todo/updates', {filter});
    this.server.subscription('/user/updates', {filter});
    database.subscribe('todos', '/todo/updates');
    database.subscribe('users', '/user/updates');
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
