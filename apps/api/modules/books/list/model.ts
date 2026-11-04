import type { GetBooksParams } from '@books/api-contract/models';

import { prisma } from '../../../prisma/prisma-client.ts';
import type { Prisma } from '../../../generated/prisma/client.ts';
import { bookWithAuthors, type BookWithAuthors } from '../shared/prisma.ts';

export interface BooksPage {
  items: BookWithAuthors[];
  total: number;
  page: number;
  perPage: number;
}

export async function queryBooks(params: GetBooksParams): Promise<BooksPage> {
  const page = params.page ?? 1;
  const perPage = params.per_page ?? 20;
  const where = createBooksWhere(params);

  const [items, total] = await prisma.$transaction([
    prisma.books.findMany({
      where,
      include: bookWithAuthors,
      orderBy: { id: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.books.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    perPage,
  };
}

function createBooksWhere(params: GetBooksParams): Prisma.booksWhereInput {
  const search = params.search?.trim();

  return {
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
}
