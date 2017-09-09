'use strict';

const Server = require('./modules/server');
const Database = require('./modules/database');

const server = new Server();
const database = new Database(server.server);

global.server = server;
global.database = database;

const tables = [
  {
    name: 'users',
    indexes: ['username'],
  },
  {
    name: 'todos',
    indexes: ['user_id'],
  },
];

database
  .connect()
  .then(() => {
    database
      .ensureDatabaseExists()
      .then(() => {
        database
          .ensureTablesExist(tables)
          .then(() => {
            server.connect();
            server.register();
            server.route();
            server.subscribe(database);
            server.extend();
            server.start();
          });
      });
  });
