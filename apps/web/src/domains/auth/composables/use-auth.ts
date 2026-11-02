import { useRouter } from 'vue-router';
import type { LoginRequest, RegisterRequest } from '@/api/generated/models';
import { login as loginRequest } from '@/domains/auth/api/login';
import { register as registerRequest } from '@/domains/auth/api/register';
import { useAuthStore } from '@/domains/auth/model/auth-store';
import type { AuthUser } from '@/domains/auth/model/auth.types';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();

  async function login(credentials: LoginRequest): Promise<AuthUser> {
    const session = await loginRequest(credentials);

    authStore.setSession(session);

    return session.user;
  }

  async function register(payload: RegisterRequest): Promise<AuthUser> {
    const result = await registerRequest(payload);

    if (result.status === 'authenticated') {
      authStore.setSession(result.session);
      return result.session.user;
    }

    authStore.logout();
    await router.replace({ name: 'login' });

    return result.user;
  }

  return {
    login,
    register,
  };
}
