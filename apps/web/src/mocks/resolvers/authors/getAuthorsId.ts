import { HttpResponse } from 'msw';

import type { AuthorResponse, Error as ApiError } from '@/api/generated/models';
import {
  parseGetAuthorsIdParams,
  type GetAuthorsIdPathParams,
} from '@/mocks/http/authors/getAuthorsId';
import { getAuthorsIdRepository } from '@/mocks/repositories/authors/getAuthorsId';

interface GetAuthorsIdRequestInfo {
  params: GetAuthorsIdPathParams;
}

function notFound(): never {
  const error: ApiError = {
    success: false,
    errors: [{ message: 'Автор не найден' }],
  };

  throw HttpResponse.json(error, { status: 404 });
}

export async function getAuthorsIdResolver({
  params,
}: GetAuthorsIdRequestInfo): Promise<AuthorResponse> {
  const parsedParams = parseGetAuthorsIdParams(params);

  if (parsedParams === undefined) {
    return notFound();
  }

  const author = await getAuthorsIdRepository.getById(parsedParams.id);

  if (author === undefined) {
    return notFound();
  }

  return {
    success: true,
    data: author,
  };
}
