import { GetBooksQueryParams } from '@books/api-contract/schemas';
import type { RequestHandler } from 'express';

import { parseRequest } from '../../../http/validation.ts';
import { queryBooks } from './model.ts';
import { booksListDto } from './view.ts';

export const getBooksList: RequestHandler = async (req, res, next) => {
  try {
    const { query } = parseRequest(req, {
      query: GetBooksQueryParams,
    });
    const booksPage = await queryBooks(query);
    const basePath = req.baseUrl.replace(/\/+$/, '');

    res.status(200).json(
      booksListDto(
        booksPage,
        (bookId) => `${basePath}/books/${bookId}/cover`,
      ),
    );
  } catch (error) {
    next(error);
  }
};
