import Auth from './auth'
import config from '../../config'

const API_URL = `http://${config.hapi.host}:${config.hapi.port}`;
const GET_URL = `${API_URL}/todos/get`;
const INSERT_URL = `${API_URL}/todos/insert`;
const UPDATE_URL = `${API_URL}/todos/update`;
const REMOVE_URL = `${API_URL}/todos/remove`;

export default {

  checkAuthError(context, response) {
    let error = context.objectResolvePath(response, 'body.error');
    if (error) {
      let code = context.objectResolvePath(response, 'body.code');
      let message = context.objectResolvePath(response, 'body.message');
      if (code === 'tokenInvalid') {
        Auth.logout();
        console.error(message);
        context.$router.push({name: 'login'});
      }
    }
  },

  handleSuccess(context, response) {
    this.checkAuthError(context, response);
    let todos = context.objectResolvePath(response, 'body.todos');
    if (todos) {
      context.$store.commit('setTodos', todos);
    }
  },

  handleFailure(context, response) {
    this.checkAuthError(context, response);
  },

  get(context) {
    const payload = {
      token: context.$store.state.token,
    };
    return context.$http.post(GET_URL, payload)
      .then(
        response => this.handleSuccess(context, response),
        response => this.handleFailure(context, response)
      )
      .catch(
        error => this.handleFailure(context, error)
      );
  },

  insert(context, message) {
    const payload = {
      token: context.$store.state.token,
      message,
    };
    return context.$http.post(INSERT_URL, payload)
      .then(
        response => this.handleSuccess(context, response),
        response => this.handleFailure(context, response)
      )
      .catch(
        error => this.handleFailure(context, error)
      );
  },

  update(context, id, data = {}) {
    const payload = {
      token: context.$store.state.token,
      id,
      data,
    };
    return context.$http.post(UPDATE_URL, payload)
      .then(
        response => this.handleSuccess(context, response),
        response => this.handleFailure(context, response)
      )
      .catch(
        error => this.handleFailure(context, error)
      );
  },

  remove(context, id) {
    const payload = {
      token: context.$store.state.token,
      id,
    };
    return context.$http.post(REMOVE_URL, payload)
      .then(
        response => this.handleSuccess(context, response),
        response => this.handleFailure(context, response)
      )
      .catch(
        error => this.handleFailure(context, error)
      );
  },

}
