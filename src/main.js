import { createApp } from 'vue';
import Toaster from '@meforma/vue-toaster';
import App from './App.vue';
import router from './router';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import FontAwesomeIcon from './components/FontAwesomeIcon';

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

const app = createApp(App);
app.use(store);
app.use(router);
app.use(Toaster, { duration: 3000 });
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
