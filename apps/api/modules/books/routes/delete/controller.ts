import type { RequestHandler } from 'express';
import { DeleteBookParams } from '@books/api-contract/schemas';

import { objectStorage } from '../../../../infrastructure/storage/s3-storage.ts';
import { parseRequest } from '../../../../http/validation.ts';
import { deleteBook as deleteBookModel } from './model.ts';

export const deleteBook: RequestHandler = async (req, res, next) => {
  try {
    const { params } = parseRequest(req, { params: DeleteBookParams });

    await deleteBookModel(params, objectStorage);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
