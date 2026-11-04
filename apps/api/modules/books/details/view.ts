import { BookResponse as BookResponseSchema } from '@books/api-contract/schemas';

import { defineMapper } from '../../../http/mapper.ts';
import { presentBook } from '../shared/view.ts';
import type { BookWithAuthors } from '../shared/prisma.ts';

export const bookDto = defineMapper(
  BookResponseSchema,
  (book: BookWithAuthors, getCoverUrl: (bookId: number) => string) => ({
    success: true as const,
    data: presentBook(book, getCoverUrl),
  }),
);
