import Vue from 'vue';
import VueResource from 'vue-resource'
import App from './components/App.vue';
import Utils from "./classes/class.utils.js";
import router from './router';
import store from './store';

Vue.use(VueResource);

const app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  methods: Utils,
});

export {app, router, store}
