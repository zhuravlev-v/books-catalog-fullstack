import type { RequestHandler } from 'express';

import type { AuthenticatedLocals } from '../../middleware/authenticate.ts';
import getSessionUser from './model.ts';
import { authSessionDto as currentSessionDto } from '../../shared/view.ts';

const getCurrentSession: RequestHandler = async (_req, res, next) => {
  try {
    const { auth } = res.locals as AuthenticatedLocals;
    const user = await getSessionUser(auth.userId);

    res.json(currentSessionDto(user, auth.accessExpiresAt));
  } catch (error) {
    next(error);
  }
};

export default getCurrentSession;
