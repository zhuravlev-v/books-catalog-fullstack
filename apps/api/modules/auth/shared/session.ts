import { randomUUID } from 'node:crypto';
import type { Prisma } from '../../../generated/prisma/client.ts';

import { env } from '../../../config/env.ts';
import { generateRefreshToken, signAccessToken } from './tokens.ts';

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthSessionResult {
  user: SessionUser;
  accessToken: string;
  accessExpiresAt: Date;
  refreshToken: string;
  refreshExpiresAt: Date;
}

export const createSession = async (
  transaction: Prisma.TransactionClient,
  user: SessionUser
): Promise<AuthSessionResult> => {
  if (user.role !== 'user') {
    throw new Error('Unsupported user role');
  }

  const sessionId = randomUUID();
  const refreshToken = generateRefreshToken();
  const refreshExpiresAt = new Date(
    Date.now() + env.AUTH_REFRESH_TOKEN_TTL_SECONDS * 1000
  );

  await transaction.refresh_tokens.create({
    data: {
      id: refreshToken.id,
      session_id: sessionId,
      user_id: user.id,
      token_hash: refreshToken.hash,
      expires_at: refreshExpiresAt,
    },
  });

  const accessToken = await signAccessToken(user.id, 'user', sessionId);

  return {
    user,
    accessToken: accessToken.token,
    accessExpiresAt: accessToken.expiresAt,
    refreshToken: refreshToken.value,
    refreshExpiresAt,
  };
};
