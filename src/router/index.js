import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Buy from '../views/Buy.vue';
import Sell from '../views/Sell.vue';
import Edit from '../views/Edit.vue';
import Transactions from '../views/Transactions.vue';
import Wallet from '../views/Wallet.vue';
import Results from '../views/Results.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { requiresAuth: false },
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    meta: { requiresAuth: false },
    component: Login,
  },
  {
    path: '/buy',
    name: 'Buy',
    meta: { requiresAuth: true },
    component: Buy,
  },
  {
    path: '/sell',
    name: 'Sell',
    meta: { requiresAuth: true },
    component: Sell,
  },
  {
    path: '/transactions',
    name: 'Transactions',
    meta: { requiresAuth: true },
    component: Transactions,
  },
  {
    path: '/edit',
    name: 'Edit',
    meta: { requiresAuth: true },
    component: Edit,
  },
  {
    path: '/wallet',
    name: 'Wallet',
    meta: { requiresAuth: true },
    component: Wallet,
  },
  {
    path: '/results',
    name: 'Results',
    meta: { requiresAuth: true },
    component: Results,
  },
  {
    path: '/404',
    name: 'NotFound',
    meta: { requiresAuth: false },
    component: () => import('../views/404.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    meta: { requiresAuth: false },
    redirect: '/404',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
