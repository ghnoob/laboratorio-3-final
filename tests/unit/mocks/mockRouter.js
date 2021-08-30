import { createRouter, createWebHistory } from 'vue-router';

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/buy',
      name: 'Buy',
      meta: { requiresAuth: true },
      component: () => import('@/views/Buy.vue'),
    },
    {
      path: '/sell',
      name: 'Sell',
      meta: { requiresAuth: true },
      component: () => import('@/views/Sell.vue'),
    },
    {
      path: '/edit',
      name: 'Edit',
      meta: { requiresAuth: true },
      component: () => import('@/views/Edit.vue'),
    },
  ],
});
