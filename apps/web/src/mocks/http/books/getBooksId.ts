import { parsePositiveIntegerPathParam } from '@/mocks/shared/http/pathParams';

export interface GetBooksIdPathParams {
  id?: string | readonly string[];
}

export interface GetBooksIdParams {
  id: number;
}

export function parseGetBooksIdParams(params: GetBooksIdPathParams): GetBooksIdParams | undefined {
  const id = parsePositiveIntegerPathParam(params.id);

  return id === undefined ? undefined : { id };
}
