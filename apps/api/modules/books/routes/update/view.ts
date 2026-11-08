import { BookResponse as BookResponseSchema } from '@books/api-contract/schemas';

import { defineMapper } from '../../../../http/mapper.ts';
import type { ObjectStorage } from '../../../../infrastructure/storage/object-storage.ts';
import type { BookWithAuthors } from '../../shared/prisma.ts';
import { presentBook } from '../../shared/view.ts';

export const updatedBookDto = defineMapper(
  BookResponseSchema,
  (book: BookWithAuthors, storage: ObjectStorage) => ({
    success: true as const,
    data: presentBook(book, (coverKey) => storage.getPublicUrl(coverKey)),
  })
);
