'use strict';

const db = global.database;
const table = 'todos';

class Todo {

  static get(user_id) {
    return db.getAll(table, user_id, 'user_id');
  }

  static insert(user_id, todo) {
    return new Promise((resolve, reject) => {
      const data = {user_id, todo};
      db.insert(table, data).then(resolve(data), reject);
    });
  }

}

module.exports = Todo;
