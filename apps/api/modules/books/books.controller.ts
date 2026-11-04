import { GetBooksQueryParams } from '@books/api-contract/schemas';
import type { RequestHandler } from 'express';

import { parseRequest } from '../../http/validation.ts';
import { getAllBooks as getAllBooksModel } from './books.model.ts';
import { toBooksView } from './books.view.ts';

const getAllBooks: RequestHandler = async (req, res, next) => {
  try {
    const { query } = parseRequest(req, {
      query: GetBooksQueryParams,
    });
    const booksPage = await getAllBooksModel(query);
    const basePath = req.baseUrl.replace(/\/+$/, '');

    res.status(200).json(
      toBooksView(
        booksPage,
        (bookId) => `${basePath}/books/${bookId}/cover`,
      ),
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getAllBooks,
};