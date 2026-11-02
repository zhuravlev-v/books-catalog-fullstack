import { HttpResponse } from 'msw';

import type { BookResponse, Error as ApiError } from '@/api/generated/models';
import { parseGetBooksIdParams, type GetBooksIdPathParams } from '@/mocks/http/books/getBooksId';
import { getBooksIdRepository } from '@/mocks/repositories/books/getBooksId';

interface GetBooksIdRequestInfo {
  params: GetBooksIdPathParams;
}

function notFound(): never {
  const error: ApiError = {
    success: false,
    errors: [{ message: 'Книга не найдена' }],
  };

  throw HttpResponse.json(error, { status: 404 });
}

export async function getBooksIdResolver({ params }: GetBooksIdRequestInfo): Promise<BookResponse> {
  const parsedParams = parseGetBooksIdParams(params);

  if (parsedParams === undefined) {
    return notFound();
  }

  const book = await getBooksIdRepository.getById(parsedParams.id);

  if (book === undefined) {
    return notFound();
  }

  return {
    success: true,
    data: book,
  };
}
