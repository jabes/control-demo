'use strict';

const hapi = require('hapi');
const rethink = require('rethinkdb');
const config = require('./config.json');

// Create a server with a host and port
const server = new hapi.Server();
server.connection(config.hapi);

// Add the route
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    return reply('hello world');
  }
});

function startServer() {
  server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
  });
}

const default_table_options = {
  primaryKey: 'id',
  durability: 'hard',
  shards: 1,
  replicas: 1,
};

function ensureTableExists(conn, table_name, table_options = default_table_options) {
  rethink
    .tableList()
    .contains(table_name)
    .do((tableExists) => {
      return rethink.branch(
        tableExists,
        {tables_created: 0},
        rethink.tableCreate(table_name, table_options)
      );
    })
    .run(conn)
    .then((result) => {
      const msg = result.tables_created
        ? `Missing table "${table_name}" was created`
        : `Table "${table_name}" was found, no action taken`;
      console.log(msg);
      startServer();
    })
    .error((error) => {
      console.log(`Failed to find or create the table: "${table_name}"`);
      console.log(error.message);
      process.exit(1);
    });
}

function ensureDatabaseExists(conn) {
  const db_name = config.rethinkdb.db;
  rethink
    .dbList()
    .contains(db_name)
    .do((databaseExists) => {
      return rethink.branch(
        databaseExists,
        {dbs_created: 0},
        rethink.dbCreate(db_name)
      );
    })
    .run(conn)
    .then((result) => {
      const msg = result.dbs_created
        ? `Missing database "${db_name}" was created`
        : `Database "${db_name}" was found, no action taken`;
      console.log(msg);
      ensureTableExists(conn, 'todos');
    })
    .error((error) => {
      console.log(`Failed to find or create the database: "${db_name}"`);
      console.log(error.message);
      process.exit(1);
    });
}

function connectDatabase() {
  rethink.connect(config.rethinkdb)
    .then((conn) => {
      console.log('Database connection initialized');
      console.log('Checking if database exists..');
      ensureDatabaseExists(conn);
    })
    .error((error) => {
      console.log('Could not open a connection to initialize the database');
      console.log(error.message);
      process.exit(1);
    });
}

connectDatabase();

