import { TopAuthorsResponse as TopAuthorsResponseSchema } from '@books/api-contract/schemas';

import { defineMapper } from '../../../../http/mapper.ts';
import type { TopAuthorResult } from './model.ts';

export const topAuthorsDto = defineMapper(
  TopAuthorsResponseSchema,
  (year: number, authors: TopAuthorResult[]) => ({
    success: true as const,
    data: {
      year,
      items: authors.map((author, index) => ({
        rank: index + 1,
        author_id: author.authorId,
        full_name: author.fullName,
        books_count: author.booksCount,
      })),
    },
  })
);
