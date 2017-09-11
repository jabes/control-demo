'use strict';

const table = 'todos';

class Todo {

  constructor(database) {
    this.db = database;
  }

  // static get(id) {
  //   return db.get(table, id);
  // }

  getAll(user_id) {
    return new Promise((resolve, reject) => {
      this.db.getAll(table, user_id, 'user_id').then(results => {
        results.sort((a, b) => a.created_at - b.created_at);
        resolve(results);
      }, reject);
    });
  }

  insert(user_id, message) {
    return this.db.insert(table, {
      user_id,
      message,
      completed: false,
      created_at: Date.now(),
    });
  }

  update(id, data = {}) {
    return this.db.update(table, id, data);
  }

  remove(id) {
    return this.db.delete(table, id);
  }

}

module.exports = Todo;
