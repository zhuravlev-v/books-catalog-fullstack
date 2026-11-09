import type { AuthSessionResponse } from '@books/api-contract/models';
import type { UserRecord } from '@/mocks/db/types';

export function hasValidPassword(
  user: UserRecord | undefined,
  password: string
): user is UserRecord {
  return user !== undefined && user.password === password;
}

export function createLoginResponse(user: UserRecord): AuthSessionResponse {
  return {
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      access_expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  };
}
