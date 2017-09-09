import Base from './base'
import {endpoints} from './api'

export default {

  ...Base,

  subscribe() {
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

  get() {
    const payload = {};
    const headers = {'Authorization': this.store.state.token};
    return this.http.post(endpoints.todos.get, payload, {headers})
      .then(
        response => this.store.commit('setTodos', response.body)
      );
  },

  insert(message) {
    const payload = {message};
    const headers = {'Authorization': this.store.state.token};
    return this.http.post(endpoints.todos.insert, payload, {headers});
  },

  update(id, data) {
    const payload = {id, data};
    const headers = {'Authorization': this.store.state.token};
    return this.http.post(endpoints.todos.update, payload, {headers});
  },

  remove(id) {
    const payload = {id};
    const headers = {'Authorization': this.store.state.token};
    return this.http.post(endpoints.todos.remove, payload, {headers});
  },

}
