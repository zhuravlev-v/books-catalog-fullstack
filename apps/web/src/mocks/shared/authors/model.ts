import type { Author, BookShort } from '@books/api-contract/models';
import type { AuthorRecord } from '@/mocks/db/types';

export function createAuthorModel(record: AuthorRecord, books: BookShort[]): Author {
  return {
    id: record.id,
    full_name: record.fullName,
    books,
  };
}
