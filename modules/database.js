'use strict';

const Rethink = require('rethinkdb');

class Database {

  constructor() {
    this.conn = null;
    this.config = require('../config');
    this.default_table_options = {
      primaryKey: 'id',
      durability: 'hard',
      shards: 1,
      replicas: 1,
    };
  }

  connect() {
    return Rethink.connect(this.config.rethinkdb)
      .then((conn) => {
        console.log('Database connection initialized');
        console.log('Checking if database exists..');
        this.conn = conn;
      })
      .error((error) => {
        console.log('Could not open a connection to initialize the database');
        console.log(error.message);
        process.exit(1);
      });
  }

  ensureTableExists() {
    const table_name = 'todos';
    const table_options = this.default_table_options;
    return Rethink
      .tableList()
      .contains(table_name)
      .do((tableExists) => {
        return Rethink.branch(
          tableExists,
          {tables_created: 0},
          Rethink.tableCreate(table_name, table_options)
        );
      })
      .run(this.conn)
      .then((result) => {
        const msg = result.tables_created
          ? `Missing table "${table_name}" was created`
          : `Table "${table_name}" was found, no action taken`;
        console.log(msg);
      })
      .error((error) => {
        console.log(`Failed to find or create the table: "${table_name}"`);
        console.log(error.message);
        process.exit(1);
      });
  }

  ensureDatabaseExists() {
    const db_name = this.config.rethinkdb.db;
    return Rethink
      .dbList()
      .contains(db_name)
      .do((databaseExists) => {
        return Rethink.branch(
          databaseExists,
          {dbs_created: 0},
          Rethink.dbCreate(db_name)
        );
      })
      .run(this.conn)
      .then((result) => {
        const msg = result.dbs_created
          ? `Missing database "${db_name}" was created`
          : `Database "${db_name}" was found, no action taken`;
        console.log(msg);
      })
      .error((error) => {
        console.log(`Failed to find or create the database: "${db_name}"`);
        console.log(error.message);
        process.exit(1);
      });
  }

}

module.exports = Database;
