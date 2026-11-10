import type { RequestHandler } from 'express';
import { GetAuthorsIdParams } from '@books/api-contract/schemas';

import { parseRequest } from '../../../../http/validation.ts';
import { queryAuthor } from './model.ts';
import { authorDto } from './view.ts';

export const getAuthor: RequestHandler = async (req, res, next) => {
  try {
    const { params } = parseRequest(req, { params: GetAuthorsIdParams });
    const author = await queryAuthor(params);

    res.status(200).json(authorDto(author));
  } catch (error) {
    next(error);
  }
};
