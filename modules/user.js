'use strict';

const Auth = require('./auth');
const Response = require('./response');
const db = global.database;
const table = 'users';

class User {

  static safe(user) {
    return {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
    };
  }

  static get(username) {
    return new Promise((resolve, reject) => {
      db
        .getAll(table, username, 'username')
        .then(response => {
          const user = response[0];
          resolve(user);
        }, reject);
    });
  }

  static create(username, password, full_name) {
    return new Promise((resolve, reject) => {
      User.get(username)
        .then(user => {
          if (user) Response.throwValidationError(reject, 'username', 'this username is taken');
          const password_hash = Auth.hashPassword(password);
          const mock = {
            username,
            password_hash,
            full_name,
          };
          db.insert(table, mock).then(response => {
            const key = response.generated_keys[0];
            db.get(table, key).then(user => {
              User.refreshToken(user).then(user => resolve(user), reject);
            }, reject);
          }, reject);
        }, reject);
    });
  }

  static refreshToken(user) {
    return new Promise((resolve, reject) => {
      const safe = User.safe(user);
      user.token = Auth.generateToken(safe);
      db.update(table, user.id, user).then(resolve(user), reject);
    });
  }

  static login(username, password) {
    return new Promise((resolve, reject) => {
      User.get(username).then(user => {
        if (user) {
          const valid = Auth.verifyPassword(password, user.password_hash);
          if (valid) User.refreshToken(user).then(user => resolve(user), reject);
          else Response.throwValidationError(reject, 'password', 'password is not valid');
        } else Response.throwValidationError(reject, 'username', 'username does not exist');
      }, reject);
    });
  }

}

module.exports = User;
