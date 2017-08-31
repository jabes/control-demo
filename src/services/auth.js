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

  handleAuthSuccess(response, redirect) {
    if (response.body.authenticated) {
      this.setToken(response.body.access_token);
      this.user.authenticated = true;
      // store.commit('login');
      if (redirect) router.push(redirect);
    }
  },

  handleAuthFailure(response) {
    console.error(response.status);
    console.error(response.statusText);
    this.logout();
  },

  logout() {
    this.removeToken();
    this.user.authenticated = false;
    // store.commit('logout');
  },

  login(credentials, redirect) {
    return app.$http.post(LOGIN_URL, credentials)
      .then(
        response => {
          this.handleAuthSuccess(response, redirect);
        },
        response => {
          this.handleAuthFailure(response);
        }
      )
      .catch(
        error => {
          this.handleAuthFailure(error);
        }
      );
  },

  signup(credentials, redirect) {
    return app.$http.post(SIGNUP_URL, credentials)
      .then(
        response => {
          this.handleAuthSuccess(response, redirect);
        },
        response => {
          this.handleAuthFailure(response);
        }
      )
      .catch(
        error => {
          this.handleAuthFailure(error);
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
