import { parsePositiveIntegerQueryParam } from '@/mocks/shared/http/queryParams';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;

export interface GetBooksQuery {
  page: number;
  perPage: number;
  authorId?: number;
  year?: number;
  search?: string;
}

export function parseGetBooksQuery(searchParams: URLSearchParams): GetBooksQuery {
  const page = parsePositiveIntegerQueryParam(searchParams.get('page')) ?? DEFAULT_PAGE;
  const perPage = parsePositiveIntegerQueryParam(searchParams.get('per-page')) ?? DEFAULT_PER_PAGE;
  const authorId = parsePositiveIntegerQueryParam(searchParams.get('author_id'));
  const year = parsePositiveIntegerQueryParam(searchParams.get('year'));
  const search = searchParams.get('search')?.trim();

  return {
    page,
    perPage,
    ...(authorId === undefined ? {} : { authorId }),
    ...(year === undefined ? {} : { year }),
    ...(!search ? {} : { search }),
  };
}
