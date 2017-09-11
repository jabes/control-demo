'use strict';

const Boom = require('boom');
const Auth = require('./auth');
const table = 'users';

const validationError = (key, message) => {
  const errors = [{key, message}];
  const validation = {errors};
  const error = Boom.badRequest(message, {validation});
  error.output.payload.validation = error.data.validation;
  return error;
};

class User {

  constructor(database) {
    this.db = database;
  }

  safe(user) {
    return {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
    };
  }

  refreshToken(user) {
    return new Promise((resolve, reject) => {
      const safe = this.safe(user);
      user.token = Auth.generateToken(safe);
      this.db.update(table, user.id, user).then(resolve(user), reject);
    });
  }

  get(id) {
    return this.db.get(table, id);
  }

  byUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.getAll(table, username, 'username').then(response => {
        const user = response[0];
        resolve(user);
      }, reject);
    });
  }

  create(username, password, full_name) {
    return new Promise((resolve, reject) => {
      this.byUsername(username).then(user => {
        if (user) reject(validationError('username', 'this username is taken'));
        const password_hash = Auth.hashPassword(password);
        const mock = {
          username,
          password_hash,
          full_name,
        };
        this.db.insert(table, mock).then(response => {
          const keys = response.generated_keys || [];
          const key = keys[0];
          this.db.get(table, key).then(user => {
            this.refreshToken(user).then(resolve, reject);
          }, reject);
        }, reject);
      }, reject);
    });
  }

  verify(username, password) {
    return new Promise((resolve, reject) => {
      this.byUsername(username).then(user => {
        if (user) {
          const valid = Auth.verifyPassword(password, user.password_hash);
          if (valid) resolve(user);
          else reject(validationError('password', 'password is not valid'));
        } else reject(validationError('username', 'username does not exist'));
      }, reject);
    });
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      this.verify(username, password).then(user => {
        const valid = Auth.isTokenValid(user.token);
        if (valid) resolve(user);
        else this.refreshToken(user).then(resolve, reject);
      }, reject);
    });
  }

  logout(id) {
    return this.db.update(table, id, {token: null});
  }

}

module.exports = User;
