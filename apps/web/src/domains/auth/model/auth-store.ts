import { computed, readonly, ref } from 'vue';
import { defineStore } from 'pinia';
import {
  loadAuthSession,
  removeStoredAuthSession,
  saveAuthSession,
} from '@/domains/auth/lib/session-storage';
import type { AuthSession, AuthUser } from '@/domains/auth/model/auth.types';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const user = ref<AuthUser | null>(null);
  const expiresAt = ref<string | null>(null);
  const isSessionRestored = ref(false);

  const isAuthenticated = computed(() => token.value !== null && user.value !== null);

  function setSession(session: AuthSession): void {
    token.value = session.token;
    user.value = session.user;
    expiresAt.value = session.expiresAt;
    saveAuthSession(session);
  }

  function logout(): void {
    token.value = null;
    user.value = null;
    expiresAt.value = null;
    removeStoredAuthSession();
  }

  function restoreSession(): void {
    try {
      const session = loadAuthSession();

      if (session === null) {
        logout();
        return;
      }

      setSession(session);
    } finally {
      isSessionRestored.value = true;
    }
  }

  return {
    token,
    user,
    expiresAt,
    isAuthenticated,
    isSessionRestored: readonly(isSessionRestored),
    setSession,
    logout,
    restoreSession,
  };
});
