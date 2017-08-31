import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  authenticated: false,
};

const mutations = {
  login(state) {
    state.authenticated = true;
  },
  logout(state) {
    state.authenticated = false;
  },
};

export function createStore() {
  return new Vuex.Store({
    state,
    mutations,
  });
}
