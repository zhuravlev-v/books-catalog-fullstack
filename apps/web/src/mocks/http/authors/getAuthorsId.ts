import { parsePositiveIntegerPathParam } from '@/mocks/shared/http/pathParams';

export interface GetAuthorsIdPathParams {
  id?: string | readonly string[];
}

export interface GetAuthorsIdParams {
  id: number;
}

export function parseGetAuthorsIdParams(
  params: GetAuthorsIdPathParams
): GetAuthorsIdParams | undefined {
  const id = parsePositiveIntegerPathParam(params.id);

  return id === undefined ? undefined : { id };
}
