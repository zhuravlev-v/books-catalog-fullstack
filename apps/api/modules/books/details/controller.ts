import type { RequestHandler } from 'express';
import { GetBooksIdParams } from '@books/api-contract/schemas';
import { parseRequest } from '../../../http/validation.ts';
import { queryBook } from './model.ts';
import { bookDto } from './view.ts';

export const getBook: RequestHandler = async (req, res, next) => {
  try {
    const { params } = parseRequest(req, {
      params: GetBooksIdParams,
    });

    const book = await queryBook(params);
    const basePath = req.baseUrl.replace(/\/+$/, '');

    res.status(200).json(bookDto(book, (bookId) => `${basePath}/books/${bookId}/cover`));
  } catch (error) {
    next(error);
  }
};
