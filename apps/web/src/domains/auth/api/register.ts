import { postAuthRegister } from '@/api/generated/endpoints';
import type { RegisterRequest } from '@/api/generated/models';
import { PostAuthRegisterResponse } from '@/api/generated/schemas';
import { getJwtExpiresAt } from '@/domains/auth/lib/jwt';
import { normalizeAuthUser } from '@/domains/auth/lib/normalize-auth-user';
import type { AuthSession, AuthUser } from '@/domains/auth/model/auth.types';

export type RegisterResult =
  | { status: 'authenticated'; session: AuthSession }
  | { status: 'login-required'; user: AuthUser };

export async function register(request: RegisterRequest): Promise<RegisterResult> {
  const response = await postAuthRegister(request);
  const result = PostAuthRegisterResponse.safeParse(response.data);

  if (!result.success) {
    throw new Error('Ответ API регистрации не соответствует контракту');
  }

  const data = result.data.data;

  if (!data?.user) {
    throw new Error('Ответ API регистрации не содержит обязательных данных пользователя');
  }

  const user = normalizeAuthUser(data.user);

  if (!data.token) {
    return { status: 'login-required', user };
  }

  return {
    status: 'authenticated',
    session: {
      token: data.token,
      user,
      expiresAt: getJwtExpiresAt(data.token),
    },
  };
}
