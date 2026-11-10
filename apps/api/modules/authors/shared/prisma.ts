import type { Prisma } from '../../../generated/prisma/client.ts';

export const authorWithBooks = {
  book_authors: {
    include: {
      books: true,
    },
    orderBy: { book_id: 'asc' },
  },
} satisfies Prisma.authorsInclude;

export type AuthorWithBooks = Prisma.authorsGetPayload<{
  include: typeof authorWithBooks;
}>;
