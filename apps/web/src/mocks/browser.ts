import { setupWorker } from 'msw/browser';

import { env } from '@/shared/config/env';

import { revokeAllBookCoverUrls } from './db/covers';
import { mockDatabase } from './db/database';
import { seedMockDatabase } from './db/seed';
import { handlers } from './handlers';

const worker = setupWorker(...handlers);

export async function startMocking(): Promise<void> {
  await mockDatabase.open();
  await seedMockDatabase();
  await worker.start({
    onUnhandledRequest(request, print) {
      if (request.url.startsWith(env.API_URL)) {
        print.warning();
      }
    },
  });

  window.addEventListener('pagehide', revokeAllBookCoverUrls, { once: true });
}
