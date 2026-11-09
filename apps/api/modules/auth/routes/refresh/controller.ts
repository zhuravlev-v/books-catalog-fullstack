import type { RequestHandler } from 'express';

import { isHttpError } from '../../../../http/errors.ts';
import {
  clearSessionCookies,
  setSessionCookies,
} from '../../shared/cookies.ts';
import { REFRESH_COOKIE_NAME } from '../../shared/tokens.ts';
import refreshSession from './model.ts';
import { authSessionDto as refreshedSessionDto } from '../../shared/view.ts';

const refresh: RequestHandler = async (req, res, next) => {
  try {
    const value = req.cookies?.[REFRESH_COOKIE_NAME];
    const session = await refreshSession(
      typeof value === 'string' ? value : undefined
    );

    setSessionCookies(res, session);
    res.json(refreshedSessionDto(session.user, session.accessExpiresAt));
  } catch (error) {
    if (isHttpError(error) && error.status === 401) {
      clearSessionCookies(res);
    }

    next(error);
  }
};

export default refresh;
