import { createApp } from 'vue';
import App from '@/App.vue';
import {
  configureApplicationApiClient,
  installApplicationProviders,
  pinia,
} from '@/app/providers';
import router, { installRouterGuards } from '@/app/router/index';
import { useAuthStore } from '@/domains/auth';
import { env } from '@/shared/config/env';
import '@/app/styles/index.css';

async function enableMocking() {
  if (env.API_MOCKING) {
    const { startMocking } = await import('@/mocks/browser');
    await startMocking();
  }
}

try {
  await enableMocking();
} catch (error) {
  console.error('Failed to initialize mock API', error);
  document.body.textContent = 'Не удалось инициализировать mock API.';
  throw error;
}

const app = createApp(App);

installApplicationProviders(app);

const authStore = useAuthStore(pinia);

authStore.restoreSession();
configureApplicationApiClient(authStore, router);
installRouterGuards(router, authStore);

app.use(router);

app.mount('#app');
