import {
  Author as AuthorSchema,
  AuthorShort as AuthorShortSchema,
} from '@books/api-contract/schemas';

import type { Prisma, authors } from '../../generated/prisma/client.ts';
import { defineMapper } from '../../http/mapper.ts';

export const authorWithBooks = {
  book_authors: {
    include: {
      books: true,
    },
  },
} satisfies Prisma.authorsInclude;

export type AuthorWithBooks = Prisma.authorsGetPayload<{
  include: typeof authorWithBooks;
}>;

export const toAuthorDto = defineMapper(
  AuthorSchema,
  (author: AuthorWithBooks) => ({
    id: author.id,
    full_name: author.full_name,
    books: author.book_authors.map(({ books }) => ({
      id: books.id,
      title: books.title,
      year: books.year,
    })),
  })
);

export const toAuthorShortDto = defineMapper(
  AuthorShortSchema,
  (author: authors) => ({
    id: author.id,
    full_name: author.full_name,
  })
);
