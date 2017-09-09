import decode from 'jwt-decode'
import {endpoints} from './api'

export default {

  app: null, // Vue
  context: null, // VueComponent
  router: null, // VueRouter
  store: null, // VueStore
  http: null,  // VueResource

  setContext(context) {
    this.context = context;
    this.app = this.context.$root;
    this.router = this.app.$router;
    this.store = this.app.$store;
    this.http = this.app.$http;
  },

  setError(error = '') {
    this.context.error = error;
  },

  setErrors(errors = []) {
    if (!errors) return;
    for (let error of errors) {
      let key = error['key'];
      let msg = error['message'];
      let constraint = error['constraint'];
      let bail = this.context.errors.hasOwnProperty(key);
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
      this.context.errors[key] = msg;
    }
  },

  clearError() {
    this.context.error = null;
  },

  clearErrors() {
    this.context.errors = {};
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

  handleResponseErrors(response) {
    this.clearError();
    this.clearErrors();
    const error = this.app.objectResolvePath(response, 'body.message');
    const errors = this.app.objectResolvePath(response, 'body.validation.errors');
    if (errors) this.setErrors(errors);
    else if (error) this.setError(error);
  },

  handleAuthSuccess(response, redirect) {
    this.handleResponseErrors(response);
    const authenticated = this.app.objectResolvePath(response, 'body.authenticated');
    if (authenticated) {
      const token = this.app.objectResolvePath(response, 'body.access_token');
      const user = this.app.objectResolvePath(response, 'body.user');
      this.store.commit('setToken', token);
      this.store.commit('setUser', user);
      if (redirect) this.router.push(redirect);
    }
  },

  handleAuthFailure(response) {
    this.handleResponseErrors(response);
    this.logout();
  },

  logout() {
    const payload = {};
    const headers = {'Authorization': this.store.state.token};
    return this.http.post(endpoints.users.logout, payload, {headers})
      .then(() => {
        this.store.commit('removeUser');
        this.store.commit('removeToken');
        this.store.commit('removeTodos');
      });
  },

  login(context, credentials, redirect) {
    this.setContext(context);
    return this.http.post(endpoints.users.login, credentials)
      .then(
        response => this.handleAuthSuccess(response, redirect),
        response => this.handleAuthFailure(response)
      )
      .catch(
        error => this.handleAuthFailure(error)
      );
  },

  signup(context, credentials, redirect) {
    this.setContext(context);
    return this.http.post(endpoints.users.signup, credentials)
      .then(
        response => this.handleAuthSuccess(response, redirect),
        response => this.handleAuthFailure(response)
      )
      .catch(
        error => this.handleAuthFailure(error)
      );
  },

  isTokenExpired(decoded) {
    const now = Math.round(Date.now() / 1000);
    const exp = decoded.exp;
    return (exp - now) < 0;
  },

  isLoggedIn(callback) {
    const token = this.store.state.token;
    if (token) {
      const decoded = decode(token);
      const expired = this.isTokenExpired(decoded);
      if (expired) return false;
      else {
        // get user info from access token on page load
        this.store.commit('setUser', decoded.user);
        this.http.post(endpoints.users.check, {token}).then(callback);
        return true;
      }
    }
    return false;
  },

}
