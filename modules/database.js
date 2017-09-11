'use strict';

const Rethink = require('rethinkdb');

class Database {

  constructor(server) {
    this.conn = null;
    this.server = server;
    this.config = {
      host: process.env.RETHINK_HOST,
      port: process.env.RETHINK_PORT,
      db: process.env.RETHINK_DB,
      user: process.env.RETHINK_USER,
      password: process.env.RETHINK_PASSWORD,
    };
    if (process.env.RETHINK_SSL_CERT) {
      this.config.ssl = {
        ca: [
          Buffer.from(process.env.RETHINK_SSL_CERT, 'base64')
        ]
      };
    }
  }

  connect() {
    console.log('Connecting to database..');
    return Rethink.connect(this.config)
      .then(conn => {
        this.conn = conn;
      })
      .error(error => {
        console.error('Could not open a connection to initialize the database');
        console.error(error.message);
        process.exit(1);
      });
  }

  ensureTableExists(table_name) {
    console.log(`Checking if table "${table_name}" exists..`);
    return Rethink
      .tableList()
      .contains(table_name)
      .do(exists => {
        return Rethink.branch(
          exists,
          {tables_created: 0},
          Rethink.tableCreate(table_name)
        );
      })
      .run(this.conn)
      .error(error => {
        console.error(`Failed to find or create the table: "${table_name}"`);
        console.error(error.message);
        process.exit(1);
      });
  }

  ensureIndexExists(table_name, index_name) {
    console.log(`Checking if index "${table_name}:${index_name}" exists..`);
    return Rethink
      .table(table_name)
      .indexList()
      .contains(index_name)
      .do(exists => {
        return Rethink.branch(
          exists,
          {created: 0},
          Rethink.table(table_name).indexCreate(index_name)
        );
      })
      .run(this.conn)
      .error(error => {
        console.error(`Failed to find or create the index: "${table_name}:${index_name}"`);
        console.error(error.message);
        process.exit(1);
      });
  }

  ensureTablesExist(tables = []) {
    return Promise.all(tables.map(table => {
      return new Promise((resolve, reject) => {
        this.ensureTableExists(table.name).then(response => {
          if (response.tables_created) {
            Promise.all(table.indexes.map(index => {
              return this.ensureIndexExists(table.name, index);
            })).then(resolve, reject);
          } else {
            resolve();
          }
        }, reject);
      });
    }));
  }

  ensureDatabaseExists(db_name = this.config.db) {
    console.log(`Checking if database "${db_name}" exists..`);
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
      .error(error => {
        console.error(`Failed to find or create the database: "${db_name}"`);
        console.error(error.message);
        process.exit(1);
      });
  }

  insert(table_name, data) {
    return Rethink
      .table(table_name)
      .insert(data)
      .run(this.conn)
      .error(error => {
        console.error(`Failed to insert record: ${data}`);
        console.error(error.message);
        process.exit(1);
      });
  }

  update(table_name, key, data) {
    return Rethink
      .table(table_name)
      .get(key)
      .update(data)
      .run(this.conn)
      .error(error => {
        console.error(`Failed to update record: ${key}:${data}`);
        console.error(error.message);
        process.exit(1);
      });
  }

  delete(table_name, key) {
    return Rethink
      .table(table_name)
      .get(key)
      .delete()
      .run(this.conn)
      .error(error => {
        console.error(`Failed to delete record: ${key}`);
        console.error(error.message);
        process.exit(1);
      });
  }

  get(table_name, key) {
    return Rethink
      .table(table_name)
      .get(key)
      .run(this.conn)
      .error(error => {
        console.error(`Failed to retrieve record: ${key}`);
        console.error(error.message);
        process.exit(1);
      });
  }

  getAll(table_name, key, index = 'id') {
    return Rethink
      .table(table_name)
      .getAll(key, {index})
      .coerceTo('array')
      .run(this.conn)
      .error(error => {
        console.error(`Failed to retrieve record: ${index}:${key}`);
        console.error(error.message);
        process.exit(1);
      });
  }

  subscribe(table_name, path) {
    return Rethink
      .table(table_name)
      .changes()
      .run(this.conn)
      .then(cursor => {
        cursor.each((err, item) => {
          if (err) console.error(err);
          else this.server.publish(path, item);
        });
      })
      .error(error => {
        console.error(`Failed to subscribe: ${path}`);
        console.error(error.message);
        process.exit(1);
      });
  }

}

module.exports = Database;
