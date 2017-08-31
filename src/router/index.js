import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import SignUp from '../components/SignUp.vue'

import Auth from '../services/auth';

Vue.use(VueRouter);

function requireAuth(to, from, next) {
  if (!Auth.isLoggedIn()) next({name: 'login'});
  next();
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: requireAuth,
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: (to, from, next) => {
      Auth.logout();
      next({name: 'login'});
    }
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
  });
}
