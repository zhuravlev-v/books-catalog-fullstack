import type { AuthSessionResponse } from '@books/api-contract/models';
import type { UserRecord } from '@/mocks/db/types';

export function createRegisterResponse(user: UserRecord): AuthSessionResponse {
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
