import type { AuthorListResponse } from '@/api/generated/models';
import { parseGetAuthorsQuery } from '@/mocks/http/authors/getAuthors';
import { authorsRepository } from '@/mocks/repositories/authors/getAuthors';
import { getAuthorsPage } from '@/mocks/services/authors/getAuthors';

interface GetAuthorsRequestInfo {
  request: Request;
}

export async function getAuthorsResolver({
  request,
}: GetAuthorsRequestInfo): Promise<AuthorListResponse> {
  const query = parseGetAuthorsQuery(new URL(request.url).searchParams);
  const authors = await authorsRepository.getAll();

  return {
    success: true,
    data: getAuthorsPage(authors, query),
  };
}
