import Nes from 'nes/client';
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

  socketConnect(context) {
    this.setContext(context);
    const client = new Nes.Client(`ws://${window.location.host}`);
    client.connect(err => {
      if (err) console.error(err);
      else {
        client.subscribe(
          '/todo/updates',
          todo => {
            const inserted = !todo.old_val && !!todo.new_val;
            const updated = !!todo.old_val && !!todo.new_val;
            const deleted = !!todo.old_val && !todo.new_val;
            if (inserted) this.store.commit('addTodo', todo.new_val);
            else if (updated) this.store.commit('updateTodo', todo.new_val);
            else if (deleted) this.store.commit('removeTodo', todo.old_val);
          },
          err => {
            if (err) console.error(err);
          }
        );
      }
    });
  },

  get(context) {
    this.setContext(context);
    const payload = {
      token: this.store.state.token,
    };
    return this.http.post(endpoints.todos.get, payload)
      .then(
        response => {
          Auth.checkTokenResponse(response);
          this.store.commit('setTodos', response.body);
        },
        response => Auth.checkTokenResponse(response)
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
        response => Auth.checkTokenResponse(response),
        response => Auth.checkTokenResponse(response)
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
        response => Auth.checkTokenResponse(response),
        response => Auth.checkTokenResponse(response)
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
        response => Auth.checkTokenResponse(response),
        response => Auth.checkTokenResponse(response)
      );
  },

}
