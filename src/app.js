// import Utils from "./classes/class.utils.js";

import Vue from 'vue';
import {createRouter} from './router';
import App from './components/App.vue';

const router = createRouter();
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
