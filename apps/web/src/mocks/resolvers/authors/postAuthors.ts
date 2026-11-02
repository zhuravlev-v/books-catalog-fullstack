import type { AuthorResponse } from '@/api/generated/models';
import { parsePostAuthorsRequest } from '@/mocks/http/authors/postAuthors';
import { requireUser } from '@/mocks/middleware/authorization';
import { postAuthorsRepository } from '@/mocks/repositories/authors/postAuthors';
import { unprocessableAuthorMutation } from '@/mocks/shared/authors/mutation';

interface PostAuthorsRequestInfo {
  request: Request;
}

export async function postAuthorsResolver({
  request,
}: PostAuthorsRequestInfo): Promise<AuthorResponse> {
  await requireUser(request);

  const parsedRequest = await parsePostAuthorsRequest(request);

  if (parsedRequest.errors !== undefined) {
    return unprocessableAuthorMutation(parsedRequest.errors);
  }

  const author = await postAuthorsRepository.create(parsedRequest.data);

  return { success: true, data: author };
}
