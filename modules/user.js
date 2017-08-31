'use strict';

const Auth = require('./auth');
const db = global.database;
const table = 'users';

class User {

  static throwError(reject, message) {
    reject({
      error: true,
      message: message,
    });
  }

  static throwValidationError(reject, key, message) {
    reject({
      error: true,
      validation: {
        errors: [{
          key: key,
          message: message,
        }]
      }
    });
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

  static create(username, password) {
    return new Promise((resolve, reject) => {
      User.get(username)
        .then(user => {
          if (user) User.throwValidationError(reject, 'username', 'this username is taken');
          const uuid = Auth.generateUUID();
          const token = Auth.generateToken(uuid);
          const hash = Auth.hashPassword(password);
          const data = {
            id: uuid,
            token: token,
            username: username,
            password_hash: hash,
          };
          db
            .insert(table, data)
            .then(response => {
              if (response.inserted) resolve(data);
              this.throwError(reject, 'Failed to create account');
            }, reject);
        }, reject);
    });
  }

  static login(username, password) {
    return new Promise((resolve, reject) => {
      User.get(username)
        .then(user => {
          if (user) {
            const valid = Auth.verifyPassword(password, user.password_hash);
            if (valid) resolve(user);
            User.throwValidationError(reject, 'password', 'password is not valid');
          }
          User.throwValidationError(reject, 'username', 'username does not exist');
        }, reject);
    });
  }

}

module.exports = User;
