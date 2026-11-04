import type { GetBooksParams } from '@books/api-contract/models';

import { db } from '../../db.ts';
import type { Prisma } from '../../generated/prisma/client.ts';

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

export interface BooksPage {
  items: BookWithAuthors[];
  total: number;
  page: number;
  perPage: number;
}

export async function getAllBooks(params: GetBooksParams): Promise<BooksPage> {
  const page = params.page ?? 1;
  const perPage = params.per_page ?? 20;
  const search = params.search?.trim();
  const where: Prisma.booksWhereInput = {
    ...(params.author_id === undefined
      ? {}
      : {
          book_authors: {
            some: {
              author_id: params.author_id,
            },
          },
        }),
    ...(params.year === undefined ? {} : { year: params.year }),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { isbn: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await db.$transaction([
    db.books.findMany({
      where,
      include: bookWithAuthors,
      orderBy: { id: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.books.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    perPage,
  };
}
