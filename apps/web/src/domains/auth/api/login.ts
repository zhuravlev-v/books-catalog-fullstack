import { postAuthLogin } from '@/api/generated/endpoints';
import type { LoginRequest } from '@/api/generated/models';
import { PostAuthLoginResponse } from '@/api/generated/schemas';
import { normalizeAuthUser } from '@/domains/auth/lib/normalize-auth-user';
import type { AuthSession } from '@/domains/auth/model/auth.types';

export async function login(request: LoginRequest): Promise<AuthSession> {
  const response = await postAuthLogin(request);
  const result = PostAuthLoginResponse.safeParse(response.data);

  if (!result.success) {
    throw new Error('Ответ API авторизации не соответствует контракту');
  }

  const data = result.data.data;

  if (!data?.token || !data.expires_at || !data.user) {
    throw new Error('Ответ API авторизации не содержит обязательных данных сессии');
  }

  return {
    token: data.token,
    user: normalizeAuthUser(data.user),
    expiresAt: data.expires_at,
  };
}
