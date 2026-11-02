import type { Table } from 'dexie';
import { HttpResponse } from 'msw';

import type { Book, Error as ApiError, ErrorItem } from '@/api/generated/models';
import { getBookCoverUrl } from '@/mocks/db/covers';
import type { AuthorRecord, BookRecord } from '@/mocks/db/types';

export class UnknownBookAuthorsError extends Error {
  constructor(readonly authorIds: number[]) {
    super(`Authors not found: ${authorIds.join(', ')}`);
    this.name = 'UnknownBookAuthorsError';
  }
}

export async function getBookAuthors(
  authorsTable: Table<AuthorRecord, number>,
  authorIds: number[]
): Promise<AuthorRecord[]> {
  const authors = await authorsTable.bulkGet(authorIds);
  const unknownAuthorIds = authorIds.filter((_, index) => authors[index] === undefined);

  if (unknownAuthorIds.length > 0) {
    throw new UnknownBookAuthorsError(unknownAuthorIds);
  }

  return authors.filter((author): author is AuthorRecord => author !== undefined);
}

export function createBookModel(record: BookRecord, authors: AuthorRecord[]): Book {
  return {
    id: record.id,
    title: record.title,
    year: record.year,
    description: record.description,
    isbn: record.isbn,
    cover_url: getBookCoverUrl(record.id, record.cover),
    authors: authors.map((author) => ({ id: author.id, full_name: author.fullName })),
  };
}

export function unprocessableBookMutation(errors: ErrorItem[]): never {
  throw HttpResponse.json<ApiError>({ success: false, errors }, { status: 422 });
}

export function unprocessableUnknownBookAuthors(error: UnknownBookAuthorsError): never {
  return unprocessableBookMutation([
    {
      field: 'author_ids',
      message: `Авторы не найдены: ${error.authorIds.join(', ')}`,
    },
  ]);
}
