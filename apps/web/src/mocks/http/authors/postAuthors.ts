import {
  parseAuthorFormRequest,
  type AuthorFormInput,
  type ParseAuthorFormResult,
} from '@/mocks/shared/authors/form';

export type CreateAuthorInput = AuthorFormInput;
export type { ParseAuthorFormResult };

export function parsePostAuthorsRequest(request: Request): Promise<ParseAuthorFormResult> {
  return parseAuthorFormRequest(request);
}
