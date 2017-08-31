// import Utils from "./classes/class.utils.js";

import Vue from 'vue';
import App from './components/App.vue';
import {createRouter} from './router';
import {createStore} from './store';
import VueResource from 'vue-resource'

Vue.use(VueResource);

const router = createRouter();
const store = createStore();

const app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});

export {app, router, store}
