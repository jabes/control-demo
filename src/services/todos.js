import Base from './base'
import Auth from './auth'
import {endpoints} from './api'

export default {

  ...Base,

  subscribe(context) {
    this.setContext(context);
    this.socketConnect().then(client => {
      client.subscribe(
        '/todo/updates',
        message => {
          const inserted = !message.old_val && !!message.new_val;
          const updated = !!message.old_val && !!message.new_val;
          const deleted = !!message.old_val && !message.new_val;
          if (inserted) this.store.commit('addTodo', message.new_val);
          else if (updated) this.store.commit('updateTodo', message.new_val);
          else if (deleted) this.store.commit('removeTodo', message.old_val);
        },
        err => {
          if (err) console.error(err);
        },
      );
    });
  },

  get(context) {
    this.setContext(context);
    const payload = {};
    const headers = {'Authorization': this.store.state.token};
    return this.http.post(endpoints.todos.get, payload, {headers})
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
    const payload = {message};
    const headers = {'Authorization': this.store.state.token};
    return this.http.post(endpoints.todos.insert, payload, {headers})
      .then(
        response => Auth.checkTokenResponse(response),
        response => Auth.checkTokenResponse(response)
      );
  },

  update(context, id, data = {}) {
    this.setContext(context);
    const payload = {id, data};
    const headers = {'Authorization': this.store.state.token};
    return this.http.post(endpoints.todos.update, payload, {headers})
      .then(
        response => Auth.checkTokenResponse(response),
        response => Auth.checkTokenResponse(response)
      );
  },

  remove(context, id) {
    this.setContext(context);
    const payload = {id};
    const headers = {'Authorization': this.store.state.token};
    return this.http.post(endpoints.todos.remove, payload, {headers})
      .then(
        response => Auth.checkTokenResponse(response),
        response => Auth.checkTokenResponse(response)
      );
  },

}
