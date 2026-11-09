import type { RequestHandler } from 'express';
import { RegisterRequest } from '@books/api-contract/schemas';
import { parseRequest } from '../../../../http/validation.ts';
import { setSessionCookies } from '../../shared/cookies.ts';
import registerUser from './model.ts';
import { authSessionDto as registeredSessionDto } from '../../shared/view.ts';

const register: RequestHandler = async (req, res, next) => {
  try {
    const { body } = parseRequest(req, {
      body: RegisterRequest,
    });

    const session = await registerUser(body);

    setSessionCookies(res, session);
    res
      .status(201)
      .json(registeredSessionDto(session.user, session.accessExpiresAt));
  } catch (error: unknown) {
    next(error);
  }
};

export default register;
