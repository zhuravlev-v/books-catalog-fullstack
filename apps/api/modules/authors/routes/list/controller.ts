import type { RequestHandler } from 'express';
import { GetAuthorsQueryParams } from '@books/api-contract/schemas';
import { parseRequest } from '../../../../http/validation.ts';
import { getAuthorsList } from './model.ts';
import { authorsListDto } from './view.ts';

export const getAuthors: RequestHandler = async (req, res, next) => {
  try {
    const { query } = parseRequest(req, { query: GetAuthorsQueryParams });

    const authors = await getAuthorsList(query);
    res.status(200).json(authorsListDto(authors));
  } catch (error) {
    next(error);
  }
};
