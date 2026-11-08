import type { RequestHandler } from 'express';
import { CreateBookBody } from '@books/api-contract/schemas';

import { objectStorage } from '../../../../infrastructure/storage/s3-storage.ts';
import { parseRequest } from '../../../../http/validation.ts';
import { createBook as createBookModel } from './model.ts';
import { createdBookDto } from './view.ts';

export const createBook: RequestHandler = async (req, res, next) => {
  try {
    const { body } = parseRequest(req, { body: CreateBookBody });
    const book = await createBookModel(body, objectStorage);

    res.status(201).json(createdBookDto(book, objectStorage));
  } catch (error) {
    next(error);
  }
};
