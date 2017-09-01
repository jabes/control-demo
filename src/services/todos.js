import Auth from './auth'
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

  handleSuccess(response) {
    Auth.checkTokenResponse(response);
    let todos = this.app.objectResolvePath(response, 'body.todos');
    if (todos) this.store.commit('setTodos', todos);
  },

  handleFailure(response) {
    Auth.checkTokenResponse(response);
  },

  get(context) {
    this.setContext(context);
    const payload = {
      token: this.store.state.token,
    };
    return this.http.post(endpoints.todos.get, payload)
      .then(
        response => this.handleSuccess(response),
        response => this.handleFailure(response)
      )
      .catch(
        error => this.handleFailure(error)
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
        response => this.handleSuccess(response),
        response => this.handleFailure(response)
      )
      .catch(
        error => this.handleFailure(error)
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
        response => this.handleSuccess(response),
        response => this.handleFailure(response)
      )
      .catch(
        error => this.handleFailure(error)
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
        response => this.handleSuccess(response),
        response => this.handleFailure(response)
      )
      .catch(
        error => this.handleFailure(error)
      );
  },

}
