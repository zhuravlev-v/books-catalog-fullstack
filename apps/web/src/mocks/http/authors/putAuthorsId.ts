import {
  parseAuthorFormRequest,
  type AuthorFormInput,
  type ParseAuthorFormResult,
} from '@/mocks/shared/authors/form';
import { parsePositiveIntegerPathParam } from '@/mocks/shared/http/pathParams';

export interface PutAuthorsIdPathParams {
  id?: string | readonly string[];
}

export interface PutAuthorsIdParams {
  id: number;
}

export type PutAuthorInput = AuthorFormInput;
export type { ParseAuthorFormResult };

export function parsePutAuthorsIdParams(
  params: PutAuthorsIdPathParams
): PutAuthorsIdParams | undefined {
  const id = parsePositiveIntegerPathParam(params.id);

  return id === undefined ? undefined : { id };
}

export function parsePutAuthorsIdRequest(request: Request): Promise<ParseAuthorFormResult> {
  return parseAuthorFormRequest(request);
}
