import type {
  getReportsTopAuthorsResponse200,
  getReportsTopAuthorsResponse400,
} from '@/api/generated/endpoints/reports/reports';
import { parseGetReportsTopAuthorsQuery } from '@/mocks/http/reports/getReportsTopAuthors';
import { topAuthorsRepository } from '@/mocks/repositories/reports/getReportsTopAuthors';
import { getTopAuthors } from '@/mocks/services/reports/getReportsTopAuthors';

interface GetReportsTopAuthorsRequestInfo {
  request: Request;
}

export type GetReportsTopAuthorsResolverResult =
  | Pick<getReportsTopAuthorsResponse200, 'data' | 'status'>
  | Pick<getReportsTopAuthorsResponse400, 'data' | 'status'>;

export async function getReportsTopAuthorsResolver({
  request,
}: GetReportsTopAuthorsRequestInfo): Promise<GetReportsTopAuthorsResolverResult> {
  const queryResult = parseGetReportsTopAuthorsQuery(new URL(request.url).searchParams);

  if (!queryResult.success) {
    return {
      status: 400,
      data: queryResult.error,
    };
  }

  const books = await topAuthorsRepository.getBooksWithAuthors();

  return {
    status: 200,
    data: {
      success: true,
      data: {
        year: queryResult.query.year,
        items: getTopAuthors(books, queryResult.query.year),
      },
    },
  };
}
