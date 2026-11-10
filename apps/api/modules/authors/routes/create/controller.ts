import type { RequestHandler } from 'express';
import { CreateAuthorBody } from '@books/api-contract/schemas';

import { parseRequest } from '../../../../http/validation.ts';
import { createAuthor as createAuthorModel } from './model.ts';
import { createdAuthorDto } from './view.ts';

export const createAuthor: RequestHandler = async (req, res, next) => {
  try {
    const { body } = parseRequest(req, { body: CreateAuthorBody });
    const author = await createAuthorModel(body);

    res.status(201).json(createdAuthorDto(author));
  } catch (error) {
    next(error);
  }
};
