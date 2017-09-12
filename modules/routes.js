'use strict';

const Joi = require('joi');
const Relish = require('relish');
const Auth = require('./auth');
const webpackConfig = require('../webpack.config');

const relish = Relish({
  stripQuotes: true,
  messages: {},
});

module.exports = function (database) {

  const User = require('./user')(database);
  const Todo = require('./todo')(database);

  return [

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
      path: '/users/check',
      config: {
        validate: {
          payload: {
            token: Joi.string().required(),
          }
        }
      },
      handler: function (request, reply) {
        const token = request.payload.token;
        const decoded = Auth.decodeToken(token);
        if (decoded) {
          User.get(decoded.user.id).then(
            user => reply({
              authenticated: user.token === token,
              user: User.safe(user),
            }),
            error => reply({authenticated: false, error}),
          );
        } else {
          reply({authenticated: false});
        }
      }
    },

    {
      method: 'POST',
      path: '/users/logout',
      config: {
        auth: 'jwt',
      },
      handler: function (request, reply) {
        User.logout(request.auth.credentials.id).then(reply);
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
        User.login(
          payload.username,
          payload.password,
        ).then(
          user => reply({
            authenticated: true,
            access_token: user.token,
            user: User.safe(user),
          }),
          error => reply(error),
        );
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
        User.create(
          payload.username,
          payload.password,
          payload.full_name,
        ).then(
          user => reply({
            authenticated: true,
            access_token: user.token,
            user: User.safe(user),
          }),
          error => reply(error),
        );
      }
    },

    {
      method: 'POST',
      path: '/todos/get',
      config: {
        auth: 'jwt',
      },
      handler: function (request, reply) {
        Todo.getAll(
          request.auth.credentials.id,
        ).then(
          response => reply(response),
          error => reply(error),
        );
      }
    },

    {
      method: 'POST',
      path: '/todos/insert',
      config: {
        auth: 'jwt',
        validate: {
          payload: {
            message: Joi.string().required(),
          }
        }
      },
      handler: function (request, reply) {
        Todo.insert(
          request.auth.credentials.id,
          request.payload.message,
        ).then(
          response => reply(response),
          error => reply(error),
        );
      }
    },

    {
      method: 'POST',
      path: '/todos/update',
      config: {
        auth: 'jwt',
        validate: {
          payload: {
            id: Joi.string().required(),
            data: Joi.object().required(),
          }
        }
      },
      handler: function (request, reply) {
        Todo.update(
          request.payload.id,
          request.payload.data,
        ).then(
          response => reply(response),
          error => reply(error),
        );
      }
    },

    {
      method: 'POST',
      path: '/todos/remove',
      config: {
        auth: 'jwt',
        validate: {
          payload: {
            id: Joi.string().required(),
          }
        }
      },
      handler: function (request, reply) {
        Todo.remove(
          request.payload.id,
        ).then(
          response => reply(response),
          error => reply(error),
        );
      }
    },

  ];
};
