import type {
  LoginResponseDataUser,
  RegisterResponseDataUser,
} from '@/api/generated/models';
import type { AuthUser } from '@/domains/auth/model/auth.types';

type AuthUserDto = LoginResponseDataUser | RegisterResponseDataUser;

export function normalizeAuthUser(user: AuthUserDto, role = 'user'): AuthUser {
  if (!user.id || !user.username || !user.email) {
    throw new Error('Ответ API авторизации не содержит обязательных данных пользователя');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: 'role' in user && user.role ? user.role : role,
  };
}
