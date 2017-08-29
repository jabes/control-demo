// import Utils from "./classes/class.utils.js";

import Vue from 'vue';
// import VueResource from 'vue-resource'
import App from './components/App.vue';
import {createRouter} from './router';
// import Auth from './auth';

const router = createRouter();
const app = new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

export {app, router}
