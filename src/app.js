/*!
 * control-demo v0.0.0
 * https://github.com/jabes/control-demo
 * Released under the MIT License.
 */

'use strict';

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
