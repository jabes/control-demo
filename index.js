'use strict';

const Server = require('./modules/server');
const Database = require('./modules/database');

const server = new Server();
const database = new Database();

database
  .connect()
  .then(() => {
    database
      .ensureDatabaseExists()
      .then(() => {
        database
          .ensureTableExists()
          .then(() => {
            server.connect();
            server.register();
            server.extend();
            server.start();
          });
      });
  });
