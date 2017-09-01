import config from '../../config'

const API_URL = `http://${config.hapi.host}:${config.hapi.port}`;
const GET_URL = `${API_URL}/todos/get`;
const INSERT_URL = `${API_URL}/todos/insert`;

export default {

  handleSuccess(context, response) {
    let todos = context.objectResolvePath(response, 'body.todos');
    if (todos) {
      todos = todos.map(row => row.todo);
      context.$store.commit('setTodos', todos);
    }
  },

  handleFailure() {},

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

  insert(context, todo) {
    const payload = {
      token: context.$store.state.token,
      todo: todo,
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

}
