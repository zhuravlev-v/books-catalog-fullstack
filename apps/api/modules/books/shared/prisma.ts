import type { Prisma } from '../../../generated/prisma/client.ts';

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
