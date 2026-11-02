import { env } from '@/shared/config/env';
import type { RegisterResponse } from '@/api/generated/models';
import { createUserAccessToken } from '@/mocks/auth/jwt';
import type { UserRecord } from '@/mocks/db/types';

export async function createRegisterResponse(
  user: UserRecord,
  secret: string = env.MOCK_JWT_SECRET
): Promise<RegisterResponse> {
  const { token } = await createUserAccessToken(user, secret);

  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.createdAt,
      },
    },
  };
}
