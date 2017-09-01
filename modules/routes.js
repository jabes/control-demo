'use strict';

const Joi = require('joi');
const Relish = require('relish');
const Auth = require('./auth');
const Response = require('./response');
const User = require('./user');
const Todo = require('./todo');
const webpackConfig = require('../webpack.config');

const relish = Relish({
  stripQuotes: true,
  messages: {},
});

function requireValidToken(request, reply) {
  const token = request.payload.token;
  if (!token) Response.throwError(reply, 'tokenRequired', 'A valid token is required');
  const decoded = Auth.verifyToken(request.payload.token);
  if (!decoded) Response.throwError(reply, 'tokenInvalid', 'Provided token is not valid');
  return decoded;
}

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
          user: User.safe(user),
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
          full_name: Joi.string().required(),
        }
      }
    },
    handler: function (request, reply) {
      const payload = request.payload;
      User.create(payload.username, payload.password, payload.full_name).then(user => {
        reply({
          authenticated: true,
          access_token: user.token,
          user: User.safe(user),
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
      const token = requireValidToken(request, reply);
      Todo.getAll(token.id).then(todos => reply({todos}), reply);
    }
  },

  {
    method: 'POST',
    path: '/todos/insert',
    config: {
      validate: {
        payload: {
          token: Joi.string().required(),
          message: Joi.string().required(),
        }
      }
    },
    handler: function (request, reply) {
      const token = requireValidToken(request, reply);
      Todo.insert(token.id, request.payload.message).then(() => {
        Todo.getAll(token.id).then(todos => reply({todos}), reply);
      }, reply);
    }
  },

  {
    method: 'POST',
    path: '/todos/update',
    config: {
      validate: {
        payload: {
          token: Joi.string().required(),
          id: Joi.string().required(),
          data: Joi.object().required(),
        }
      }
    },
    handler: function (request, reply) {
      const token = requireValidToken(request, reply);
      Todo.update(request.payload.id, request.payload.data).then(() => {
        Todo.getAll(token.id).then(todos => reply({todos}), reply);
      }, reply);
    }
  },

  {
    method: 'POST',
    path: '/todos/remove',
    config: {
      validate: {
        payload: {
          token: Joi.string().required(),
          id: Joi.string().required(),
        }
      }
    },
    handler: function (request, reply) {
      const token = requireValidToken(request, reply);
      Todo.remove(request.payload.id).then(() => {
        Todo.getAll(token.id).then(todos => reply({todos}), reply);
      }, reply);
    }
  },

];
