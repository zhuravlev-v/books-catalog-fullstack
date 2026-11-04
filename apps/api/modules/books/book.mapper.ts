import {
  Book as BookSchema,
  BookShort as BookShortSchema,
} from '@books/api-contract/schemas';

import type { Prisma } from '../../generated/prisma/client.ts';
import { defineMapper } from '../../http/mapper.ts';

export const bookWithAuthors = {
  book_authors: {
    include: {
      authors: true,
    },
  },
} satisfies Prisma.booksInclude;

export type BookWithAuthors = Prisma.booksGetPayload<{
  include: typeof bookWithAuthors;
}>;

export const toBookDto = defineMapper(
  BookSchema,
  (book: BookWithAuthors, getCoverUrl: (bookId: number) => string) => ({
    id: book.id,
    title: book.title,
    year: book.year,
    description: book.description,
    isbn: book.isbn,
    cover_url: book.cover === null ? null : getCoverUrl(book.id),
    authors: book.book_authors.map(({ authors }) => ({
      id: authors.id,
      full_name: authors.full_name,
    })),
  }),
);

export const toBookShortDto = defineMapper(
  BookShortSchema,
  (book: Pick<BookWithAuthors, 'id' | 'title' | 'year'>) => ({
    id: book.id,
    title: book.title,
    year: book.year,
  }),
);
