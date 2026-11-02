import { SignJWT } from 'jose';

import type { UserRecord } from '@/mocks/db/types';
import { env } from '@/shared/config/env';

export const MOCK_JWT_ALGORITHM = 'HS256' as const;
export const MOCK_JWT_ISSUER = 'book-catalog-mock';
export const MOCK_JWT_AUDIENCE = 'book-catalog-frontend';
export const MOCK_JWT_EXPIRES_IN_SECONDS = 60 * 60;

export function getMockJwtSecret(secret: string = env.MOCK_JWT_SECRET): Uint8Array {
  return new TextEncoder().encode(secret);
}

export interface UserAccessToken {
  token: string;
  expiresAt: string;
}

export async function createUserAccessToken(
  user: UserRecord,
  secret: string = env.MOCK_JWT_SECRET
): Promise<UserAccessToken> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + MOCK_JWT_EXPIRES_IN_SECONDS;
  const token = await new SignJWT({ username: user.username, role: user.role })
    .setProtectedHeader({ alg: MOCK_JWT_ALGORITHM, typ: 'JWT' })
    .setSubject(user.id)
    .setIssuer(MOCK_JWT_ISSUER)
    .setAudience(MOCK_JWT_AUDIENCE)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .sign(getMockJwtSecret(secret));

  return {
    token,
    expiresAt: new Date(expiresAt * 1000).toISOString(),
  };
}
