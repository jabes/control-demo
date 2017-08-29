import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from '../views/home.vue'
import LoginView from '../views/login.vue'

Vue.use(VueRouter);

export function createRouter() {
  return new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({x: 0, y: 0}),
    routes: [
      {path: '/', component: HomeView},
      {path: '/login', component: LoginView},
    ]
  })
}
