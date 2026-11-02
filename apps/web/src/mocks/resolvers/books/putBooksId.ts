import { HttpResponse } from 'msw';

import type { BookResponse } from '@/api/generated/models';
import {
  parsePutBooksIdParams,
  parsePutBooksIdRequest,
  type PutBooksIdPathParams,
} from '@/mocks/http/books/putBooksId';
import { requireUser } from '@/mocks/middleware/authorization';
import { putBooksIdRepository } from '@/mocks/repositories/books/putBooksId';
import {
  UnknownBookAuthorsError,
  unprocessableBookMutation,
  unprocessableUnknownBookAuthors,
} from '@/mocks/shared/books/mutation';

interface PutBooksIdRequestInfo {
  request: Request;
  params: PutBooksIdPathParams;
}

function notFound(): never {
  throw new HttpResponse(null, { status: 404 });
}

export async function putBooksIdResolver({
  request,
  params,
}: PutBooksIdRequestInfo): Promise<BookResponse> {
  await requireUser(request);

  const parsedParams = parsePutBooksIdParams(params);

  if (parsedParams === undefined) {
    return notFound();
  }

  const parsedRequest = await parsePutBooksIdRequest(request);

  if (parsedRequest.errors !== undefined) {
    return unprocessableBookMutation(parsedRequest.errors);
  }

  try {
    const result = await putBooksIdRepository.put(parsedParams.id, parsedRequest.data);

    if (result === 'not-found') {
      return notFound();
    }

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof UnknownBookAuthorsError) {
      return unprocessableUnknownBookAuthors(error);
    }

    throw error;
  }
}
