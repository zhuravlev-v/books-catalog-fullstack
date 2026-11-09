import type { RequestHandler } from 'express';

import { clearSessionCookies } from '../../shared/cookies.ts';
import { REFRESH_COOKIE_NAME } from '../../shared/tokens.ts';
import logout from './model.ts';

const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    const value = req.cookies?.[REFRESH_COOKIE_NAME];

    await logout(typeof value === 'string' ? value : undefined);
    clearSessionCookies(res);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export default logoutUser;
