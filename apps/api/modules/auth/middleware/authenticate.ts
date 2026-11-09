import type { RequestHandler } from 'express';

import { unauthorizedError } from '../shared/errors.ts';
import {
  ACCESS_COOKIE_NAME,
  type AccessTokenContext,
  verifyAccessToken,
} from '../shared/tokens.ts';

export interface AuthenticatedLocals {
  auth: AccessTokenContext;
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.[ACCESS_COOKIE_NAME];

    if (typeof token !== 'string') {
      throw unauthorizedError();
    }

    try {
      res.locals.auth = await verifyAccessToken(token);
    } catch {
      throw unauthorizedError();
    }

    next();
  } catch (error) {
    next(error);
  }
};
