import { Author as AuthorSchema } from '@books/api-contract/schemas';

import { defineMapper } from '../../../http/mapper.ts';
import type { AuthorWithBooks } from './prisma.ts';

export const presentAuthor = defineMapper(
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
