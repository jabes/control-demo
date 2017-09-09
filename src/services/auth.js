import decode from 'jwt-decode'
import Base from './base'
import {endpoints} from './api'

export default {

  ...Base,

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

  handleAuthSuccess(response, redirect) {
    if (response.body.authenticated) {
      this.store.commit('setToken', response.body.access_token);
      this.store.commit('setUser', response.body.user);
      if (redirect) this.router.push(redirect);
    }
  },

  handleAuthFailure(response) {
    this.clearError();
    this.clearErrors();
    const error = response.body.message;
    const errors = response.body.validation.errors;
    if (errors) this.setErrors(errors);
    else if (error) this.setError(error);
  },

  logout() {
    const payload = {};
    const headers = {'Authorization': this.store.state.token};
    this.http.post(endpoints.users.logout, payload, {headers});
    this.disconnectAllSockets();
    this.store.commit('removeUser');
    this.store.commit('removeToken');
    this.store.commit('removeAllTodos');
  },

  login(credentials, redirect) {
    return this.http.post(endpoints.users.login, credentials)
      .then(
        response => this.handleAuthSuccess(response, redirect),
        response => this.handleAuthFailure(response),
      );
  },

  signup(credentials, redirect) {
    return this.http.post(endpoints.users.signup, credentials)
      .then(
        response => this.handleAuthSuccess(response, redirect),
        response => this.handleAuthFailure(response),
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
