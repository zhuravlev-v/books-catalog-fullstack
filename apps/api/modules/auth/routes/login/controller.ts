import type { RequestHandler } from 'express';
import { LoginRequest } from '@books/api-contract/schemas';

import { parseRequest } from '../../../../http/validation.ts';
import { setSessionCookies } from '../../shared/cookies.ts';
import login from './model.ts';
import { authSessionDto as loggedInSessionDto } from '../../shared/view.ts';

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { body } = parseRequest(req, { body: LoginRequest });
    const session = await login(body);

    setSessionCookies(res, session);
    res.json(loggedInSessionDto(session.user, session.accessExpiresAt));
  } catch (error) {
    next(error);
  }
};

export default loginUser;
