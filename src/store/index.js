import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  token: localStorage.getItem('access_token'),
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
  setTodos(state, todos) {
    state.todos = todos;
  },
  removeTodos(state) {
    state.todos = [];
  },
};

const store = new Vuex.Store({
  state,
  mutations,
});

export default store;
