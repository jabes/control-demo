'use strict';

module.exports = function (database) {

  const table = 'todos';

  return {

    get(id) {
      return database.get(table, id);
    },

    getAll(user_id) {
      return new Promise((resolve, reject) => {
        database.getAll(table, user_id, 'user_id').then(results => {
          results.sort((a, b) => a.created_at - b.created_at);
          resolve(results);
        }, reject);
      });
    },

    insert(user_id, message) {
      return database.insert(table, {
        user_id,
        message,
        completed: false,
        created_at: Date.now(),
      });
    },

    update(id, data = {}) {
      return database.update(table, id, data);
    },

    remove(id) {
      return database.remove(table, id);
    },

  };
};
