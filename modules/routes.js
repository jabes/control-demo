'use strict';

const Joi = require('joi');
const Relish = require('relish');
const Auth = require('./auth');
const User = require('./user');
const Todo = require('./todo');
const webpackConfig = require('../webpack.config');

const relish = Relish({
  stripQuotes: true,
  messages: {},
});

module.exports = [

  {
    method: 'GET',
    path: '/{path*}',
    config: {
      cache: {
        expiresIn: 24 * 60 * 60 * 1000,
        privacy: 'public',
      }
    },
    handler: {
      directory: {
        path: webpackConfig.output.path,
        listing: false,
        index: true,
      }
    }
  },

  {
    method: 'POST',
    path: '/users/login',
    config: {
      validate: {
        failAction: relish.failAction,
        options: {
          abortEarly: false,
        },
        payload: {
          username: Joi.string().min(3).max(30).alphanum().required(),
          password: Joi.string().min(3).max(30).required(),
        }
      }
    },
    handler: function (request, reply) {
      const payload = request.payload;
      User.login(payload.username, payload.password).then(user => {
        reply({
          authenticated: true,
          access_token: user.token,
        });
      }, error => {
        reply(Object.assign({
          authenticated: false,
        }, error));
      });
    }
  },

  {
    method: 'POST',
    path: '/users/create',
    config: {
      validate: {
        failAction: relish.failAction,
        options: {
          abortEarly: false,
        },
        payload: {
          username: Joi.string().min(3).max(30).alphanum().required(),
          password: Joi.string().min(3).max(30).required(),
          password_confirm: Joi.string().valid(Joi.ref('password')).required(),
        }
      }
    },
    handler: function (request, reply) {
      const payload = request.payload;
      User.create(payload.username, payload.password).then(user => {
        reply({
          authenticated: true,
          access_token: user.token,
        });
      }, error => {
        reply(Object.assign({
          authenticated: false,
        }, error));
      });
    }
  },

  {
    method: 'POST',
    path: '/todos/get',
    config: {
      validate: {
        payload: {
          token: Joi.string().required(),
        }
      }
    },
    handler: function (request, reply) {
      const token = Auth.verifyToken(request.payload.token);
      if (!token) reply();
      Todo.get(token.id).then(todos => reply({todos}), reply);
    }
  },

  {
    method: 'POST',
    path: '/todos/insert',
    config: {
      validate: {
        payload: {
          token: Joi.string().required(),
          todo: Joi.string().required(),
        }
      }
    },
    handler: function (request, reply) {
      const token = Auth.verifyToken(request.payload.token);
      if (!token) reply();
      Todo.insert(token.id, request.payload.todo).then(() => {
        Todo.get(token.id).then(todos => reply({todos}), reply);
      }, reply);
    }
  },

];
