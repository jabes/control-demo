import {app, router} from '../app'
import config from '../../config'
import decode from 'jwt-decode'

const API_URL = `http://${config.hapi.host}:${config.hapi.port}`;
const LOGIN_URL = `${API_URL}/users/login`;
const SIGNUP_URL = `${API_URL}/users/create`;

export default {

  user: {
    authenticated: false
  },

  setToken(access_token) {
    localStorage.setItem('access_token', access_token);
  },

  getToken() {
    return localStorage.getItem('access_token');
  },

  removeToken() {
    localStorage.removeItem('access_token');
  },

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
    if (response.body.error) {
      if (response.body.validation) this.setErrors(context, response.body.validation.errors);
      else if (response.body.message) this.setError(context, response.body.message);
      else this.setError(context, 'Unable to login with the provided username and password');
    }
  },

  handleAuthSuccess(context, response, redirect) {
    this.handleResponseErrors(context, response);
    if (response.body.authenticated) {
      this.setToken(response.body.access_token);
      this.user.authenticated = true;
      if (redirect) router.push(redirect);
    }
  },

  handleAuthFailure(context, response) {
    this.handleResponseErrors(context, response);
    this.logout();
  },

  logout() {
    this.removeToken();
    this.user.authenticated = false;
  },

  login(context, credentials, redirect) {
    return app.$http.post(LOGIN_URL, credentials)
      .then(
        response => {
          this.handleAuthSuccess(context, response, redirect);
        },
        response => {
          this.handleAuthFailure(context, response);
        }
      )
      .catch(
        error => {
          this.handleAuthFailure(context, error);
        }
      );
  },

  signup(context, credentials, redirect) {
    return app.$http.post(SIGNUP_URL, credentials)
      .then(
        response => {
          this.handleAuthSuccess(context, response, redirect);
        },
        response => {
          this.handleAuthFailure(context, response);
        }
      )
      .catch(
        error => {
          this.handleAuthFailure(context, error);
        }
      );
  },

  getTokenExpirationDate(encodedToken) {
    const date = new Date(0);
    const token = decode(encodedToken);
    if (!token.exp) return null;
    date.setUTCSeconds(token.exp);
    return date;
  },

  isTokenExpired(token) {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate < new Date();
  },

  isLoggedIn() {
    const token = this.getToken();
    if (token) {
      const expired = this.isTokenExpired(token);
      return !expired;
    }
    return false;
  },

}
