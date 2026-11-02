import { z } from 'zod';
import type { AuthSession } from '@/domains/auth/model/auth.types';

const AUTH_SESSION_STORAGE_KEY = 'infotek.auth.session';

const authSessionSchema = z.object({
  token: z.string().trim().min(1),
  user: z.object({
    id: z.string().min(1),
    username: z.string().min(1),
    email: z.email(),
    role: z.string().min(1),
  }),
  expiresAt: z.iso.datetime({ offset: true }),
});

function removeStoredAuthSession(): void {
  try {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  } catch {
    // The in-memory session remains usable when storage is unavailable.
  }
}

export function loadAuthSession(): AuthSession | null {
  try {
    const storedSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

    if (storedSession === null) {
      return null;
    }

    const result = authSessionSchema.safeParse(JSON.parse(storedSession));

    if (!result.success || Date.parse(result.data.expiresAt) <= Date.now()) {
      removeStoredAuthSession();
      return null;
    }

    return result.data;
  } catch {
    removeStoredAuthSession();
    return null;
  }
}

export function saveAuthSession(session: AuthSession): void {
  try {
    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // The in-memory session remains usable when storage is unavailable.
  }
}

export { removeStoredAuthSession };
