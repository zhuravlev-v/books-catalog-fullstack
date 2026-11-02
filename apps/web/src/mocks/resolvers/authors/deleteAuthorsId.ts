import { HttpResponse } from 'msw';

import {
  parseDeleteAuthorsIdParams,
  type DeleteAuthorsIdPathParams,
} from '@/mocks/http/authors/deleteAuthorsId';
import { requireUser } from '@/mocks/middleware/authorization';
import { deleteAuthorsIdRepository } from '@/mocks/repositories/authors/deleteAuthorsId';

interface DeleteAuthorsIdRequestInfo {
  request: Request;
  params: DeleteAuthorsIdPathParams;
}

function notFound(): never {
  throw new HttpResponse(null, { status: 404 });
}

export async function deleteAuthorsIdResolver({
  request,
  params,
}: DeleteAuthorsIdRequestInfo): Promise<void> {
  await requireUser(request);

  const parsedParams = parseDeleteAuthorsIdParams(params);

  if (parsedParams === undefined) {
    return notFound();
  }

  const result = await deleteAuthorsIdRepository.deleteById(parsedParams.id);

  if (result === 'not-found') {
    return notFound();
  }
}
