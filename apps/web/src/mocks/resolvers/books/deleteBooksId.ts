import { HttpResponse } from 'msw';

import {
  parseDeleteBooksIdParams,
  type DeleteBooksIdPathParams,
} from '@/mocks/http/books/deleteBooksId';
import { requireUser } from '@/mocks/middleware/authorization';
import { deleteBooksIdRepository } from '@/mocks/repositories/books/deleteBooksId';

interface DeleteBooksIdRequestInfo {
  request: Request;
  params: DeleteBooksIdPathParams;
}

function notFound(): never {
  throw new HttpResponse(null, { status: 404 });
}

export async function deleteBooksIdResolver({
  request,
  params,
}: DeleteBooksIdRequestInfo): Promise<void> {
  await requireUser(request);

  const parsedParams = parseDeleteBooksIdParams(params);

  if (parsedParams === undefined) {
    return notFound();
  }

  const result = await deleteBooksIdRepository.deleteById(parsedParams.id);

  if (result === 'not-found') {
    return notFound();
  }
}
