import { defineRouter } from '#q-app';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import { useAuthStore } from '../modules/auth/stores/auth.store';
import { useAuthorizationStore } from '../modules/authorization/stores/authorization.store';

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  Router.beforeEach((to) => {
    const authStore = useAuthStore();
    const authorizationStore = useAuthorizationStore();

    authStore.restaurarSesion();

    const requiereAutenticacion = to.path.startsWith('/app');
    const esLogin = to.path === '/auth/login';

    if (requiereAutenticacion && !authStore.autenticado) {
      return {
        path: '/auth/login',
        query: {
          redirect: to.fullPath,
        },
      };
    }

    if (esLogin && authStore.autenticado) {
      return '/app/dashboard';
    }

    if (to.meta.roles && (!authStore.usuario || !to.meta.roles.includes(authStore.usuario.rol))) {
      return '/app/dashboard';
    }

    if (to.meta.requiresSubscription === true && !authStore.accesoPermitido) {
      return '/app/subscription';
    }

    if (to.meta.module) {
      const puedeVerModulo = authorizationStore.puedeVer(to.meta.module);

      if (!puedeVerModulo) {
        return '/app/dashboard';
      }
    }

    return true;
  });

  if (import.meta.hot) {
    handleHotUpdate(Router);
  }

  return Router;
});
