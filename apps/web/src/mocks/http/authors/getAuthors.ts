import { parsePositiveIntegerQueryParam } from '@/mocks/shared/http/queryParams';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;

export interface GetAuthorsQuery {
  page: number;
  perPage: number;
  search?: string;
}

export function parseGetAuthorsQuery(searchParams: URLSearchParams): GetAuthorsQuery {
  const page = parsePositiveIntegerQueryParam(searchParams.get('page')) ?? DEFAULT_PAGE;
  const perPage = parsePositiveIntegerQueryParam(searchParams.get('per-page')) ?? DEFAULT_PER_PAGE;
  const search = searchParams.get('search')?.trim();

  return {
    page,
    perPage,
    ...(!search ? {} : { search }),
  };
}
