import type { Router } from 'vue-router';
import { configureApiClient } from '@/api/client/request';
import type { useAuthStore } from '@/domains/auth';
import { notify } from '@/shared/lib/notifications';

const AUTH_ENDPOINT_PATHS = ['/auth/login', '/auth/register'];

type AuthStore = ReturnType<typeof useAuthStore>;

function isAuthRequest(url: string): boolean {
  const pathname = new URL(url, window.location.origin).pathname.replace(/\/+$/, '');

  return AUTH_ENDPOINT_PATHS.some((path) => pathname.endsWith(path));
}

export function configureApplicationApiClient(authStore: AuthStore, router: Router): void {
  let unauthorizedRedirect: Promise<void> | null = null;

  configureApiClient({
    getAccessToken: () => authStore.token,
    onUnauthorized: async (_error, url) => {
      authStore.logout();

      if (isAuthRequest(url) || router.currentRoute.value.name === 'login') {
        return;
      }

      if (unauthorizedRedirect === null) {
        notify.error('Сессия истекла. Войдите снова.');

        const redirect = router.currentRoute.value.fullPath.split('#', 1)[0] || '/';

        unauthorizedRedirect = router
          .replace({ name: 'login', query: { redirect } })
          .then(() => undefined)
          .finally(() => {
            unauthorizedRedirect = null;
          });
      }

      await unauthorizedRedirect;
    },
  });
}
