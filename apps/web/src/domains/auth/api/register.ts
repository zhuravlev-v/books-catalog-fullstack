import { postAuthRegister } from '@/api/generated/endpoints';
import type { RegisterRequest } from '@books/api-contract/models';
import { PostAuthRegisterResponse } from '@books/api-contract/schemas';
import { normalizeAuthUser } from '@/domains/auth/lib/normalize-auth-user';
import type { AuthSession } from '@/domains/auth/model/auth.types';

export async function register(request: RegisterRequest): Promise<AuthSession> {
  const response = await postAuthRegister(request);
  const result = PostAuthRegisterResponse.safeParse(response.data);

  if (!result.success) {
    throw new Error('Ответ API регистрации не соответствует контракту');
  }

  const data = result.data.data;

  if (!data?.user) {
    throw new Error(
      'Ответ API регистрации не содержит обязательных данных пользователя'
    );
  }

  if (!data.access_expires_at) {
    throw new Error('Ответ API регистрации не содержит срока действия сессии');
  }

  return {
    user: normalizeAuthUser(data.user),
    expiresAt: data.access_expires_at,
  };
}
