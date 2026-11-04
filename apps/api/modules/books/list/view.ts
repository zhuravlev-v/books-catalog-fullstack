import { BookListResponse as BookListResponseSchema } from '@books/api-contract/schemas';

import { defineMapper } from '../../../http/mapper.ts';
import { presentBook } from '../shared/view.ts';
import type { BooksPage } from './model.ts';

export const booksListDto = defineMapper(
  BookListResponseSchema,
  (booksPage: BooksPage, getCoverUrl: (bookId: number) => string) => ({
    success: true as const,
    data: {
      items: booksPage.items.map((book) => presentBook(book, getCoverUrl)),
      pagination: {
        total: booksPage.total,
        page: booksPage.page,
        per_page: booksPage.perPage,
        total_pages: Math.ceil(booksPage.total / booksPage.perPage),
      },
    },
  })
);
