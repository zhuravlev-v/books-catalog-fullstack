import {
  Book as BookSchema,
  BookListResponse as BookListResponseSchema,
  BookShort as BookShortSchema,
} from '@books/api-contract/schemas';

import { defineMapper } from '../../http/mapper.ts';
import type { BooksPage, BookWithAuthors } from './books.model.ts';

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

export const toBooksView = defineMapper(
  BookListResponseSchema,
  (booksPage: BooksPage, getCoverUrl: (bookId: number) => string) => ({
    success: true as const,
    data: {
      items: booksPage.items.map((book) => toBookDto(book, getCoverUrl)),
      pagination: {
        total: booksPage.total,
        page: booksPage.page,
        per_page: booksPage.perPage,
        total_pages: Math.ceil(booksPage.total / booksPage.perPage),
      },
    },
  }),
);
