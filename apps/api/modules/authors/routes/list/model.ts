import type { GetAuthorsParams } from '@books/api-contract/models';
import { prisma } from '../../../../prisma/prisma-client.ts';
import type { authors, Prisma } from '../../../../generated/prisma/client.ts';

export interface AuthorsPage {
  items: authors[];
  total: number;
  page: number;
  perPage: number;
}

export async function getAuthorsList(
  query: GetAuthorsParams
): Promise<AuthorsPage> {
  const page = query.page ?? 1;
  const perPage = query.per_page ?? 20;
  const where = createAuthorsWhere(query);

  const [items, total] = await prisma.$transaction([
    prisma.authors.findMany({
      where,
      orderBy: { id: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.authors.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    perPage,
  };
}

function createAuthorsWhere(query: GetAuthorsParams): Prisma.authorsWhereInput {
  const search = query.search?.trim();

  return {
    ...(search
      ? {
          OR: [{ full_name: { contains: search, mode: 'insensitive' } }],
        }
      : {}),
  };
}
