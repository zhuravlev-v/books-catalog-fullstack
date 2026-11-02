import type { Router } from 'vue-router';
import type { useAuthStore } from '@/domains/auth';
import { getSafeRedirect } from './redirect';

type AuthStore = ReturnType<typeof useAuthStore>;

export function installRouterGuards(router: Router, authStore: AuthStore): void {
  router.beforeEach((to) => {
    if (to.meta.access === 'guest' && authStore.isAuthenticated) {
      return { name: 'home' };
    }

    if (to.meta.access === 'protected' && !authStore.isAuthenticated) {
      const redirect = getSafeRedirect(to.fullPath.split('#', 1)[0]);

      return { name: 'login', query: { redirect } };
    }

    return true;
  });
}
