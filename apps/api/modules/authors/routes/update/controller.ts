import type { RequestHandler } from 'express';
import {
  UpdateAuthorBody,
  UpdateAuthorParams,
} from '@books/api-contract/schemas';

import { parseRequest } from '../../../../http/validation.ts';
import { updateAuthor as updateAuthorModel } from './model.ts';
import { updatedAuthorDto } from './view.ts';

const UpdateAuthorRequestBody = UpdateAuthorBody.refine(
  (body) => body.full_name !== undefined,
  { message: 'Необходимо указать хотя бы одно поле' }
);

export const updateAuthor: RequestHandler = async (req, res, next) => {
  try {
    const { body, params } = parseRequest(req, {
      body: UpdateAuthorRequestBody,
      params: UpdateAuthorParams,
    });
    const author = await updateAuthorModel(params, body);

    res.status(200).json(updatedAuthorDto(author));
  } catch (error) {
    next(error);
  }
};
