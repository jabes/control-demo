import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import SignUp from '../components/SignUp.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: SignUp
  },
];

export function createRouter() {
  return new VueRouter({
    routes
  })
}
