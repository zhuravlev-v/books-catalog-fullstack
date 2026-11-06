import { GetBooksQueryParams } from '@books/api-contract/schemas';
import type { RequestHandler } from 'express';

import { objectStorage } from '../../../infrastructure/storage/s3-storage.ts';
import { parseRequest } from '../../../http/validation.ts';
import { queryBooks } from './model.ts';
import { booksListDto } from './view.ts';

export const getBooksList: RequestHandler = async (req, res, next) => {
  try {
    const { query } = parseRequest(req, {
      query: GetBooksQueryParams,
    });
    const booksPage = await queryBooks(query);

    res
      .status(200)
      .json(
        booksListDto(booksPage, (coverKey) =>
          objectStorage.getPublicUrl(coverKey)
        )
      );
  } catch (error) {
    next(error);
  }
};
