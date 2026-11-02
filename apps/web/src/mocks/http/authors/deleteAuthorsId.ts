import { parsePositiveIntegerPathParam } from '@/mocks/shared/http/pathParams';

export interface DeleteAuthorsIdPathParams {
  id?: string | readonly string[];
}

export interface DeleteAuthorsIdParams {
  id: number;
}

export function parseDeleteAuthorsIdParams(
  params: DeleteAuthorsIdPathParams
): DeleteAuthorsIdParams | undefined {
  const id = parsePositiveIntegerPathParam(params.id);

  return id === undefined ? undefined : { id };
}
