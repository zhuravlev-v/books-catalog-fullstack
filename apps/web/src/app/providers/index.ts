import type { App } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { pinia } from './pinia';
import { queryClient } from './query-client';

export { configureApplicationApiClient } from './api-client';
export { pinia } from './pinia';
export { queryClient } from './query-client';

export function installApplicationProviders(app: App): void {
  app.use(pinia);
  app.use(VueQueryPlugin, { queryClient });
}
