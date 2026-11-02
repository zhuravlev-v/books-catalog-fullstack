import { env } from '@/shared/config/env';
import type { LoginResponse } from '@/api/generated/models';
import { createUserAccessToken } from '@/mocks/auth/jwt';
import type { UserRecord } from '@/mocks/db/types';

export function hasValidPassword(
  user: UserRecord | undefined,
  password: string
): user is UserRecord {
  return user !== undefined && user.password === password;
}

export async function createLoginResponse(
  user: UserRecord,
  secret: string = env.MOCK_JWT_SECRET
): Promise<LoginResponse> {
  const { token, expiresAt } = await createUserAccessToken(user, secret);

  return {
    success: true,
    data: {
      token,
      expires_at: expiresAt,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    },
  };
}
