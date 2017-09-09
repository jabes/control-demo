import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './components/App.vue';
import store from './store';
import router from './router';

Vue.use(VueResource);

new Vue({
  store,
  router,
  render: h => h(App),
  el: '#app',
});
