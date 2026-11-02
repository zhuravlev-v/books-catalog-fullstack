import type { Error } from '@/api/generated/models';

export interface GetReportsTopAuthorsQuery {
  year: number;
}

export type GetReportsTopAuthorsQueryResult =
  | {
      success: true;
      query: GetReportsTopAuthorsQuery;
    }
  | {
      success: false;
      error: Error;
    };

const INVALID_YEAR_ERROR: Error = {
  success: false,
  errors: [
    {
      field: 'year',
      message: 'Параметр year не указан или неверен',
    },
  ],
};

export function parseGetReportsTopAuthorsQuery(
  searchParams: URLSearchParams
): GetReportsTopAuthorsQueryResult {
  const value = searchParams.get('year');

  if (value === null || !/^[1-9]\d*$/.test(value)) {
    return {
      success: false,
      error: INVALID_YEAR_ERROR,
    };
  }

  const year = Number(value);

  if (!Number.isSafeInteger(year)) {
    return {
      success: false,
      error: INVALID_YEAR_ERROR,
    };
  }

  return {
    success: true,
    query: { year },
  };
}
