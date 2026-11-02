import { parsePositiveIntegerPathParam } from '@/mocks/shared/http/pathParams';

export interface DeleteBooksIdPathParams {
  id?: string | readonly string[];
}

export interface DeleteBooksIdParams {
  id: number;
}

export function parseDeleteBooksIdParams(
  params: DeleteBooksIdPathParams
): DeleteBooksIdParams | undefined {
  const id = parsePositiveIntegerPathParam(params.id);

  return id === undefined ? undefined : { id };
}
