import type { AuthUser as AuthUserDto } from '@books/api-contract/models';
import type { AuthUser } from '@/domains/auth/model/auth.types';

export function normalizeAuthUser(user: AuthUserDto): AuthUser {
  if (!user.id || !user.username || !user.email) {
    throw new Error(
      'Ответ API авторизации не содержит обязательных данных пользователя'
    );
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}
