import {
  parseBookFormRequest,
  type BookFormInput,
  type ParseBookFormResult,
} from '@/mocks/shared/books/form';

export type CreateBookInput = BookFormInput;
export type { ParseBookFormResult };

export function parsePostBooksRequest(request: Request): Promise<ParseBookFormResult> {
  return parseBookFormRequest(request);
}
