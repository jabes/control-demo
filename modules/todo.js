'use strict';

const db = global.database;
const table = 'todos';

class Todo {

  static get(user_id) {
    return new Promise((resolve, reject) => {
      db.getAll(table, user_id, 'user_id').then(results => {
        results.sort((a, b) => a.created_at - b.created_at);
        resolve(results);
      }, reject);
    });
  }

  static insert(user_id, todo) {
    return new Promise((resolve, reject) => {
      const data = {
        user_id,
        created_at: Date.now(),
        todo,
      };
      db.insert(table, data).then(resolve(data), reject);
    });
  }

}

module.exports = Todo;
