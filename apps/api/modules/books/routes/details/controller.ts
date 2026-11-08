import type { RequestHandler } from 'express';
import { GetBooksIdParams } from '@books/api-contract/schemas';

import { objectStorage } from '../../../../infrastructure/storage/s3-storage.ts';
import { parseRequest } from '../../../../http/validation.ts';
import { queryBook } from './model.ts';
import { bookDto } from './view.ts';

export const getBook: RequestHandler = async (req, res, next) => {
  try {
    const { params } = parseRequest(req, {
      params: GetBooksIdParams,
    });

    const book = await queryBook(params);

    res
      .status(200)
      .json(bookDto(book, (coverKey) => objectStorage.getPublicUrl(coverKey)));
  } catch (error) {
    next(error);
  }
};
