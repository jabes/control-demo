import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './components/App.vue';
import Utils from "./classes/class.utils.js";
import store from './store';
import router from './router';

Vue.use(VueResource);

new Vue({
  el: '#app',
  render: h => h(App),
  methods: Utils,
  store,
  router,
});
