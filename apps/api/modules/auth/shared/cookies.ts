import type { CookieOptions, Response } from 'express';

import { env } from '../../../config/env.ts';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from './tokens.ts';

interface SessionCookies {
  accessToken: string;
  accessExpiresAt: Date;
  refreshToken: string;
  refreshExpiresAt: Date;
}

const apiPath = env.API_BASE_PATH.replace(/\/+$/, '') || '/';
const refreshPath = `${apiPath}/auth`;

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: env.NODE_ENV === 'production',
};

const cookieOptions = (path: string, expiresAt: Date): CookieOptions => ({
  ...baseCookieOptions,
  path,
  expires: expiresAt,
  maxAge: Math.max(0, expiresAt.getTime() - Date.now()),
});

export const setSessionCookies = (
  response: Response,
  cookies: SessionCookies
) => {
  response.cookie(
    ACCESS_COOKIE_NAME,
    cookies.accessToken,
    cookieOptions(apiPath, cookies.accessExpiresAt)
  );
  response.cookie(
    REFRESH_COOKIE_NAME,
    cookies.refreshToken,
    cookieOptions(refreshPath, cookies.refreshExpiresAt)
  );
};

export const clearSessionCookies = (response: Response) => {
  response.clearCookie(ACCESS_COOKIE_NAME, {
    ...baseCookieOptions,
    path: apiPath,
  });
  response.clearCookie(REFRESH_COOKIE_NAME, {
    ...baseCookieOptions,
    path: refreshPath,
  });
};
