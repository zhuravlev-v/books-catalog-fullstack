import { prisma } from '../../../../prisma/prisma-client.ts';

const TOP_AUTHORS_LIMIT = 10;

export interface TopAuthorResult {
  authorId: number;
  fullName: string;
  booksCount: number;
}

export async function queryTopAuthors(
  year: number
): Promise<TopAuthorResult[]> {
  const counts = await prisma.book_authors.groupBy({
    by: ['author_id'],
    where: { books: { year } },
    _count: { book_id: true },
    orderBy: [{ _count: { book_id: 'desc' } }, { author_id: 'asc' }],
    take: TOP_AUTHORS_LIMIT,
  });

  const authors = await prisma.authors.findMany({
    where: { id: { in: counts.map(({ author_id }) => author_id) } },
    select: { id: true, full_name: true },
  });
  const authorsById = new Map(authors.map((author) => [author.id, author]));

  return counts.map(({ author_id, _count }) => {
    const author = authorsById.get(author_id);

    if (author === undefined) {
      throw new Error(`Author ${author_id} was not found`);
    }

    return {
      authorId: author.id,
      fullName: author.full_name,
      booksCount: _count.book_id,
    };
  });
}
