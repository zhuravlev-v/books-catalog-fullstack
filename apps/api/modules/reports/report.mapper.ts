import { TopAuthor as TopAuthorSchema } from '@books/api-contract/schemas';

import { defineMapper } from '../../http/mapper.ts';

export interface TopAuthorRow {
  author_id: number;
  full_name: string;
  books_count: bigint | number;
}

export const toTopAuthorDto = defineMapper(TopAuthorSchema, (row: TopAuthorRow, index: number) => {
  const booksCount = Number(row.books_count);

  if (!Number.isSafeInteger(booksCount) || booksCount < 0) {
    throw new Error(`Invalid books count for author ${row.author_id}`);
  }

  return {
    rank: index + 1,
    author_id: row.author_id,
    full_name: row.full_name,
    books_count: booksCount,
  };
});
