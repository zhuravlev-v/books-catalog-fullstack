import type { RequestHandler } from 'express';
import { UpdateBookBody, UpdateBookParams } from '@books/api-contract/schemas';

import { objectStorage } from '../../../../infrastructure/storage/s3-storage.ts';
import { parseRequest } from '../../../../http/validation.ts';
import { updateBook as updateBookModel } from './model.ts';
import { updatedBookDto } from './view.ts';

export const updateBook: RequestHandler = async (req, res, next) => {
  try {
    const { body, params } = parseRequest(req, {
      body: UpdateBookBody,
      params: UpdateBookParams,
    });
    const book = await updateBookModel(params, body, objectStorage);

    res.status(200).json(updatedBookDto(book, objectStorage));
  } catch (error) {
    next(error);
  }
};
