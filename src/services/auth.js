import decode from 'jwt-decode'
import {endpoints} from './api'

export default {

  app: null,
  router: null,
  store: null,
  http: null,

  setContext(context) {
    this.app = context.$root;
    this.router = this.app.$router;
    this.store = this.app.$store;
    this.http = this.app.$http;
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

  checkTokenResponse(response) {
    let error = this.app.objectResolvePath(response, 'body.error');
    if (error) {
      let code = this.app.objectResolvePath(response, 'body.code');
      let message = this.app.objectResolvePath(response, 'body.message');
      if (code === 'tokenInvalid') {
        this.logout();
        console.error(message);
        this.router.push({name: 'login'});
      }
    }
  },

  handleResponseErrors(context, response) {
    this.clearError(context);
    this.clearErrors(context);
    const error = this.app.objectResolvePath(response, 'body.message');
    const errors = this.app.objectResolvePath(response, 'body.validation.errors');
    if (errors) this.setErrors(context, errors);
    else if (error) this.setError(context, error);
  },

  handleAuthSuccess(context, response, redirect) {
    this.handleResponseErrors(context, response);
    const authenticated = this.app.objectResolvePath(response, 'body.authenticated');
    const token = this.app.objectResolvePath(response, 'body.access_token');
    if (authenticated && token) {
      this.store.commit('setToken', token);
      if (redirect) this.router.push(redirect);
    }
  },

  handleAuthFailure(context, response) {
    this.handleResponseErrors(context, response);
    this.logout();
  },

  logout() {
    this.store.commit('removeToken');
    this.store.commit('removeTodos');
  },

  login(context, credentials, redirect) {
    this.setContext(context);
    return this.http.post(endpoints.users.login, credentials)
      .then(
        response => this.handleAuthSuccess(context, response, redirect),
        response => this.handleAuthFailure(context, response)
      )
      .catch(
        error => this.handleAuthFailure(context, error)
      );
  },

  signup(context, credentials, redirect) {
    this.setContext(context);
    return this.http.post(endpoints.users.signup, credentials)
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
    const token = this.store.state.token;
    if (token) {
      const expired = this.isTokenExpired(token);
      return !expired;
    }
    return false;
  },

}
