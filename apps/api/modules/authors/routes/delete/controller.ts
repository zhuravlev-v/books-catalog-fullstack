import type { RequestHandler } from 'express';
import { DeleteAuthorParams } from '@books/api-contract/schemas';

import { parseRequest } from '../../../../http/validation.ts';
import { deleteAuthor as deleteAuthorModel } from './model.ts';

export const deleteAuthor: RequestHandler = async (req, res, next) => {
  try {
    const { params } = parseRequest(req, { params: DeleteAuthorParams });

    await deleteAuthorModel(params);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
