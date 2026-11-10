import { GetReportsTopAuthorsQueryParams } from '@books/api-contract/schemas';
import type { RequestHandler } from 'express';

import { parseRequest } from '../../../../http/validation.ts';
import { queryTopAuthors } from './model.ts';
import { topAuthorsDto } from './view.ts';

export const getTopAuthors: RequestHandler = async (req, res, next) => {
  try {
    const { query } = parseRequest(req, {
      query: GetReportsTopAuthorsQueryParams,
    });
    const authors = await queryTopAuthors(query.year);

    res.status(200).json(topAuthorsDto(query.year, authors));
  } catch (error) {
    next(error);
  }
};
