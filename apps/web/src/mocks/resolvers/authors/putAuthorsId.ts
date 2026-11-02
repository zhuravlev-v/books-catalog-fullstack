import { HttpResponse } from 'msw';

import type { AuthorResponse } from '@/api/generated/models';
import {
  parsePutAuthorsIdParams,
  parsePutAuthorsIdRequest,
  type PutAuthorsIdPathParams,
} from '@/mocks/http/authors/putAuthorsId';
import { requireUser } from '@/mocks/middleware/authorization';
import { putAuthorsIdRepository } from '@/mocks/repositories/authors/putAuthorsId';
import { unprocessableAuthorMutation } from '@/mocks/shared/authors/mutation';

interface PutAuthorsIdRequestInfo {
  request: Request;
  params: PutAuthorsIdPathParams;
}

function notFound(): never {
  throw new HttpResponse(null, { status: 404 });
}

export async function putAuthorsIdResolver({
  request,
  params,
}: PutAuthorsIdRequestInfo): Promise<AuthorResponse> {
  await requireUser(request);

  const parsedParams = parsePutAuthorsIdParams(params);

  if (parsedParams === undefined) {
    return notFound();
  }

  const parsedRequest = await parsePutAuthorsIdRequest(request);

  if (parsedRequest.errors !== undefined) {
    return unprocessableAuthorMutation(parsedRequest.errors);
  }

  const result = await putAuthorsIdRepository.put(parsedParams.id, parsedRequest.data);

  if (result === 'not-found') {
    return notFound();
  }

  return { success: true, data: result };
}
