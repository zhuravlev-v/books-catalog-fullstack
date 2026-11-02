import { jwtVerify, type JWTPayload } from 'jose';
import { HttpResponse } from 'msw';

import {
  getMockJwtSecret,
  MOCK_JWT_ALGORITHM,
  MOCK_JWT_AUDIENCE,
  MOCK_JWT_ISSUER,
} from '@/mocks/auth/jwt';

export interface AuthenticationContext {
  claims: JWTPayload;
  userId?: string;
  username?: string;
  role?: string;
}

function unauthorized(): never {
  throw new HttpResponse(null, { status: 401 });
}

function getBearerToken(request: Request): string | undefined {
  const authorization = request.headers.get('Authorization');
  const match = authorization?.match(/^Bearer ([^\s]+)$/i);

  return match?.[1];
}

export async function authenticateRequest(request: Request): Promise<AuthenticationContext> {
  const token = getBearerToken(request);

  if (token === undefined) {
    return unauthorized();
  }

  try {
    const { payload } = await jwtVerify(token, getMockJwtSecret(), {
      algorithms: [MOCK_JWT_ALGORITHM],
      issuer: MOCK_JWT_ISSUER,
      audience: MOCK_JWT_AUDIENCE,
    });

    return {
      claims: payload,
      ...(payload.sub === undefined ? {} : { userId: payload.sub }),
      ...(typeof payload.username === 'string' ? { username: payload.username } : {}),
      ...(typeof payload.role === 'string' ? { role: payload.role } : {}),
    };
  } catch {
    return unauthorized();
  }
}
