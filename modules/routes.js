'use strict';

const Joi = require('joi');
const Auth = require('./auth');
const User = require('./user');
const webpackConfig = require('../webpack.config');

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
    path: '/sessions/check',
    config: {
      validate: {
        payload: {
          id: Joi.string().required(),
        }
      }
    },
    handler: function (request, reply) {
      const payload = request.payload;
      const decoded = Auth.verifyToken(payload.access_token);
      reply({
        valid: !!decoded
      });
    }
  },

  {
    method: 'POST',
    path: '/users/login',
    config: {
      validate: {
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
        reply({
          authenticated: false,
          error: error.message,
        });
      });
    }
  },

  {
    method: 'POST',
    path: '/users/create',
    config: {
      validate: {
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
        reply({
          authenticated: false,
          error: error.message,
        });
      });
    }
  },

];
