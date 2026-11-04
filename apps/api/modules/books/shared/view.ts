import {
  Book as BookSchema,
  BookShort as BookShortSchema,
} from '@books/api-contract/schemas';

import { defineMapper } from '../../../http/mapper.ts';
import type { BookWithAuthors } from './prisma.ts';

export const presentBook = defineMapper(
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

export const presentBookShort = defineMapper(
  BookShortSchema,
  (book: Pick<BookWithAuthors, 'id' | 'title' | 'year'>) => ({
    id: book.id,
    title: book.title,
    year: book.year,
  }),
);
