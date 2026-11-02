import { HttpResponse } from 'msw';

import type { BookResponse } from '@/api/generated/models';
import {
  parsePatchBooksIdParams,
  parsePatchBooksIdRequest,
  type PatchBooksIdPathParams,
} from '@/mocks/http/books/patchBooksId';
import { requireUser } from '@/mocks/middleware/authorization';
import { patchBooksIdRepository } from '@/mocks/repositories/books/patchBooksId';
import {
  UnknownBookAuthorsError,
  unprocessableBookMutation,
  unprocessableUnknownBookAuthors,
} from '@/mocks/shared/books/mutation';

interface PatchBooksIdRequestInfo {
  request: Request;
  params: PatchBooksIdPathParams;
}

function notFound(): never {
  throw new HttpResponse(null, { status: 404 });
}

export async function patchBooksIdResolver({
  request,
  params,
}: PatchBooksIdRequestInfo): Promise<BookResponse> {
  await requireUser(request);

  const parsedParams = parsePatchBooksIdParams(params);

  if (parsedParams === undefined) {
    return notFound();
  }

  const parsedRequest = await parsePatchBooksIdRequest(request);

  if (parsedRequest.errors !== undefined) {
    return unprocessableBookMutation(parsedRequest.errors);
  }

  try {
    const result = await patchBooksIdRepository.patch(parsedParams.id, parsedRequest.data);

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
