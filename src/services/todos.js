import {endpoints, checkAuthError} from './api'

export default {

  handleSuccess(context, response) {
    checkAuthError(context, response);
    let todos = context.objectResolvePath(response, 'body.todos');
    if (todos) {
      context.$store.commit('setTodos', todos);
    }
  },

  handleFailure(context, response) {
    checkAuthError(context, response);
  },

  get(context) {
    const payload = {
      token: context.$store.state.token,
    };
    return context.$http.post(endpoints.todos.get, payload)
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
    return context.$http.post(endpoints.todos.insert, payload)
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
    return context.$http.post(endpoints.todos.update, payload)
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
    return context.$http.post(endpoints.todos.remove, payload)
      .then(
        response => this.handleSuccess(context, response),
        response => this.handleFailure(context, response)
      )
      .catch(
        error => this.handleFailure(context, error)
      );
  },

}
