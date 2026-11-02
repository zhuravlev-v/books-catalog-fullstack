import {
  parseBookFormRequest,
  type BookFormInput,
  type ParseBookFormResult,
} from '@/mocks/shared/books/form';
import { parsePositiveIntegerPathParam } from '@/mocks/shared/http/pathParams';

export interface PutBooksIdPathParams {
  id?: string | readonly string[];
}

export interface PutBooksIdParams {
  id: number;
}

export type PutBookInput = BookFormInput;
export type { ParseBookFormResult };

export function parsePutBooksIdParams(params: PutBooksIdPathParams): PutBooksIdParams | undefined {
  const id = parsePositiveIntegerPathParam(params.id);

  return id === undefined ? undefined : { id };
}

export function parsePutBooksIdRequest(request: Request): Promise<ParseBookFormResult> {
  return parseBookFormRequest(request);
}
