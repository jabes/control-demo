import {router} from '../app'
import config from '../../config'

const API_URL = `http://${config.hapi.host}:${config.hapi.port}`;
const LOGIN_URL = `${API_URL}/sessions/create`;
const SIGNUP_URL = `${API_URL}/users/create`;

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login(context, credentials, redirect) {
    context.$http.post(LOGIN_URL, credentials, (data) => {
      localStorage.setItem('id_token', data.id_token);
      localStorage.setItem('access_token', data.access_token);
      this.user.authenticated = true;
      if (redirect) router.go(redirect);
    }).error((err) => {
      context.error = err;
    });
  },

  signup(context, credentials, redirect) {
    context.$http.post(SIGNUP_URL, credentials, (data) => {
      localStorage.setItem('id_token', data.id_token);
      localStorage.setItem('access_token', data.access_token);
      this.user.authenticated = true;
      if (redirect) router.go(redirect);
    }).error((err) => {
      context.error = err;
    });
  },

  // To log out, we just need to remove the token
  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    this.user.authenticated = false;
  },

  checkAuth() {
    this.user.authenticated = localStorage.getItem('id_token') !== null;
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader() {
    const auth_type = 'Bearer';
    const auth_token = localStorage.getItem('access_token');
    return {
      'Authorization': `${auth_type} ${auth_token}`
    };
  },

}
