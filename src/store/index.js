import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  token: localStorage.getItem('access_token'),
  user: null,
  todos: [],
};

const mutations = {

  setToken(state, token) {
    localStorage.setItem('access_token', token);
    state.token = token;
  },

  removeToken(state) {
    localStorage.removeItem('access_token');
    state.token = null;
  },

  setUser(state, user) {
    state.user = user;
  },

  removeUser(state) {
    state.user = null;
  },

  setTodos(state, todos) {
    state.todos = todos;
  },

  removeTodos(state) {
    state.todos = [];
  },

  addTodo(state, todo) {
    state.todos.push(todo);
  },

  updateTodo(state, todo) {
    for (let i = 0; i < state.todos.length; i++) {
      if (state.todos[i].id === todo.id) {
        state.todos.splice(i, 1, todo);
        break;
      }
    }
  },

  removeTodo(state, todo) {
    for (let i = 0; i < state.todos.length; i++) {
      if (state.todos[i].id === todo.id) {
        state.todos.splice(i, 1);
        break;
      }
    }
  },

};

const store = new Vuex.Store({
  state,
  mutations,
});

export default store;
