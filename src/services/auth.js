import {app, router, store} from '../app'
import config from '../../config'
import decode from 'jwt-decode'

const API_URL = `http://${config.hapi.host}:${config.hapi.port}`;
const LOGIN_URL = `${API_URL}/users/login`;
const SIGNUP_URL = `${API_URL}/users/create`;

export default {

  setError(context, error = '') {
    context.error = error;
  },

  setErrors(context, errors = []) {
    if (!errors) return;
    for (let error of errors) {
      let key = error['key'];
      let msg = error['message'];
      let constraint = error['constraint'];
      let bail = context.errors.hasOwnProperty(key);
      if (bail) continue;
      if (constraint) {
        switch (constraint) {
          case 'empty':
            msg = 'not allowed to be empty';
            break;
          case 'allowOnly':
            if (key === 'password_confirm') msg = 'passwords must match';
            break;
        }
      }
      context.errors[key] = msg;
    }
  },

  clearError(context) {
    context.error = null;
  },

  clearErrors(context) {
    context.errors = {};
  },

  handleResponseErrors(context, response) {
    this.clearError(context);
    this.clearErrors(context);
    const error = app.objectResolvePath(response, 'body.message');
    const errors = app.objectResolvePath(response, 'body.validation.errors');
    if (errors) this.setErrors(context, errors);
    else if (error) this.setError(context, error);
  },

  handleAuthSuccess(context, response, redirect) {
    this.handleResponseErrors(context, response);
    const authenticated = app.objectResolvePath(response, 'body.authenticated');
    const token = app.objectResolvePath(response, 'body.access_token');
    if (authenticated && token) {
      store.commit('setToken', token);
      if (redirect) router.push(redirect);
    }
  },

  handleAuthFailure(context, response) {
    this.handleResponseErrors(context, response);
    this.logout();
  },

  logout() {
    store.commit('removeToken');
    store.commit('removeTodos');
  },

  login(context, credentials, redirect) {
    return app.$http.post(LOGIN_URL, credentials)
      .then(
        response => this.handleAuthSuccess(context, response, redirect),
        response => this.handleAuthFailure(context, response)
      )
      .catch(
        error => this.handleAuthFailure(context, error)
      );
  },

  signup(context, credentials, redirect) {
    return app.$http.post(SIGNUP_URL, credentials)
      .then(
        response => this.handleAuthSuccess(context, response, redirect),
        response => this.handleAuthFailure(context, response)
      )
      .catch(
        error => this.handleAuthFailure(context, error)
      );
  },

  isTokenExpired(token) {
    const now = Math.round(Date.now() / 1000);
    const exp = decode(token).exp;
    return (exp - now) < 0;
  },

  isLoggedIn() {
    // const token = store.state.token;
    const token = localStorage.getItem('access_token');
    if (token) {
      const expired = this.isTokenExpired(token);
      return !expired;
    }
    return false;
  },

}
