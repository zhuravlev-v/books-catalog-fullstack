import {
  createHash,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';

import { env } from '../../../config/env.ts';

export const ACCESS_COOKIE_NAME = 'access_token';
export const REFRESH_COOKIE_NAME = 'refresh_token';

const JWT_ALGORITHM = 'HS256';
const jwtSecret = new TextEncoder().encode(env.JWT_SECRET);
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface AccessTokenContext {
  userId: string;
  role: 'user';
  sessionId: string;
  accessExpiresAt: Date;
}

export interface RefreshTokenParts {
  id: string;
  secret: string;
}

export interface GeneratedRefreshToken extends RefreshTokenParts {
  value: string;
  hash: string;
}

export const hashRefreshTokenSecret = (secret: string) =>
  createHash('sha256').update(secret).digest('hex');

export const generateRefreshToken = (): GeneratedRefreshToken => {
  const id = randomUUID();
  const secret = randomBytes(32).toString('base64url');

  return {
    id,
    secret,
    value: `${id}.${secret}`,
    hash: hashRefreshTokenSecret(secret),
  };
};

export const parseRefreshToken = (
  value: string | undefined
): RefreshTokenParts | null => {
  if (value === undefined) {
    return null;
  }

  const separatorIndex = value.indexOf('.');
  const id = value.slice(0, separatorIndex);
  const secret = value.slice(separatorIndex + 1);

  if (
    separatorIndex === -1 ||
    !uuidPattern.test(id) ||
    !/^[A-Za-z0-9_-]{43}$/.test(secret)
  ) {
    return null;
  }

  return { id, secret };
};

export const refreshTokenMatches = (secret: string, expectedHash: string) => {
  const actual = Buffer.from(hashRefreshTokenSecret(secret), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');

  return actual.length === expected.length && timingSafeEqual(actual, expected);
};

export const signAccessToken = async (
  userId: string,
  role: 'user',
  sessionId: string
) => {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + env.JWT_ACCESS_TOKEN_TTL_SECONDS;
  const token = await new SignJWT({ role, sid: sessionId })
    .setProtectedHeader({ alg: JWT_ALGORITHM, typ: 'JWT' })
    .setSubject(userId)
    .setJti(randomUUID())
    .setIssuer(env.JWT_ISSUER)
    .setAudience(env.JWT_AUDIENCE)
    .setIssuedAt(now)
    .setExpirationTime(expiresAt)
    .sign(jwtSecret);

  return {
    token,
    expiresAt: new Date(expiresAt * 1000),
  };
};

export const verifyAccessToken = async (
  token: string
): Promise<AccessTokenContext> => {
  const { payload } = await jwtVerify(token, jwtSecret, {
    algorithms: [JWT_ALGORITHM],
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  if (
    payload.sub === undefined ||
    !uuidPattern.test(payload.sub) ||
    payload.role !== 'user' ||
    typeof payload.sid !== 'string' ||
    !uuidPattern.test(payload.sid) ||
    typeof payload.jti !== 'string' ||
    payload.exp === undefined
  ) {
    throw new Error('Access Token claims are invalid');
  }

  return {
    userId: payload.sub,
    role: payload.role,
    sessionId: payload.sid,
    accessExpiresAt: new Date(payload.exp * 1000),
  };
};
