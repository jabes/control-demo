import Vue from 'vue'
import VueRouter from 'vue-router'

import Dashboard from '../components/Dashboard.vue'
import Login from '../components/Login.vue'
import SignUp from '../components/SignUp.vue'

import Auth from '../services/auth';

Vue.use(VueRouter);

function requireAuth(to, from, next) {
  Auth.setContext(router.app);
  const authenticated = Auth.isLoggedIn();
  if (!authenticated) next({name: 'login'});
  next();
}

const routes = [
  {
    path: '/',
    redirect: 'dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
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
      Auth.setContext(router.app);
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

const router = new VueRouter({
  routes
});

export default router;
