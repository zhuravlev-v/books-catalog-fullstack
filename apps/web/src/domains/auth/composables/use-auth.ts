import type { LoginRequest, RegisterRequest } from '@books/api-contract/models';
import { login as loginRequest } from '@/domains/auth/api/login';
import { register as registerRequest } from '@/domains/auth/api/register';
import { useAuthStore } from '@/domains/auth/model/auth-store';
import type { AuthUser } from '@/domains/auth/model/auth.types';

export function useAuth() {
  const authStore = useAuthStore();

  async function login(credentials: LoginRequest): Promise<AuthUser> {
    const session = await loginRequest(credentials);

    authStore.setSession(session);

    return session.user;
  }

  async function register(payload: RegisterRequest): Promise<AuthUser> {
    const session = await registerRequest(payload);

    authStore.setSession(session);

    return session.user;
  }

  return {
    login,
    register,
  };
}
