'use strict';

const db = global.database;
const table = 'todos';

class Todo {

  // static get(id) {
  //   return db.get(table, id);
  // }

  static getAll(user_id) {
    return new Promise((resolve, reject) => {
      db.getAll(table, user_id, 'user_id').then(results => {
        results.sort((a, b) => a.created_at - b.created_at);
        resolve(results);
      }, reject);
    });
  }

  static insert(user_id, message) {
    return db.insert(table, {
      user_id,
      message,
      completed: false,
      created_at: Date.now(),
    });
  }

  static update(id, data = {}) {
    return db.update(table, id, data);
  }

  static remove(id) {
    return db.delete(table, id);
  }

}

module.exports = Todo;
