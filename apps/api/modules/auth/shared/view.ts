import { AuthSessionResponse } from '@books/api-contract/schemas';

import { defineMapper } from '../../../http/mapper.ts';
import type { SessionUser } from './session.ts';

export const authSessionDto = defineMapper(
  AuthSessionResponse,
  (user: SessionUser, accessExpiresAt: Date) => ({
    success: true as const,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role as 'user',
      },
      access_expires_at: accessExpiresAt.toISOString(),
    },
  })
);
