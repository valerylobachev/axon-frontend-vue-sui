import Vue from 'vue';
import Router from 'vue-router';
import authService from '@/annette/core/auth/auth-service';
import axonRoutes from '@/axon/routes';


Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
      ...axonRoutes,
  ],
});

router.beforeEach(authService.authGuard);

export default router
