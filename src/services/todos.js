import Auth from './auth'
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

  handleSuccess(context, response) {
    Auth.setContext(context);
    Auth.checkTokenResponse(response);
    let todos = this.app.objectResolvePath(response, 'body.todos');
    if (todos) this.store.commit('setTodos', todos);
  },

  handleFailure(context, response) {
    Auth.setContext(context);
    Auth.checkTokenResponse(response);
  },

  get(context) {
    this.setContext(context);
    const payload = {
      token: this.store.state.token,
    };
    return this.http.post(endpoints.todos.get, payload)
      .then(
        response => this.handleSuccess(context, response),
        response => this.handleFailure(context, response)
      )
      .catch(
        error => this.handleFailure(context, error)
      );
  },

  insert(context, message) {
    this.setContext(context);
    const payload = {
      token: this.store.state.token,
      message,
    };
    return this.http.post(endpoints.todos.insert, payload)
      .then(
        response => this.handleSuccess(context, response),
        response => this.handleFailure(context, response)
      )
      .catch(
        error => this.handleFailure(context, error)
      );
  },

  update(context, id, data = {}) {
    this.setContext(context);
    const payload = {
      token: this.store.state.token,
      id,
      data,
    };
    return this.http.post(endpoints.todos.update, payload)
      .then(
        response => this.handleSuccess(context, response),
        response => this.handleFailure(context, response)
      )
      .catch(
        error => this.handleFailure(context, error)
      );
  },

  remove(context, id) {
    this.setContext(context);
    const payload = {
      token: this.store.state.token,
      id,
    };
    return this.http.post(endpoints.todos.remove, payload)
      .then(
        response => this.handleSuccess(context, response),
        response => this.handleFailure(context, response)
      )
      .catch(
        error => this.handleFailure(context, error)
      );
  },

}
