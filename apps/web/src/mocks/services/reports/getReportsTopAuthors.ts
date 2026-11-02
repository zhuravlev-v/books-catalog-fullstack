import type { TopAuthor } from '@/api/generated/models';
import type { TopAuthorsReportBook } from '@/mocks/repositories/reports/getReportsTopAuthors';

const TOP_AUTHORS_LIMIT = 10;

interface AuthorBookCount {
  authorId: number;
  fullName: string;
  booksCount: number;
}

export function getTopAuthors(books: TopAuthorsReportBook[], year: number): TopAuthor[] {
  const authorsById = new Map<number, AuthorBookCount>();

  for (const book of books) {
    if (book.year !== year) {
      continue;
    }

    for (const author of book.authors) {
      const currentAuthor = authorsById.get(author.id);

      authorsById.set(author.id, {
        authorId: author.id,
        fullName: author.fullName,
        booksCount: (currentAuthor?.booksCount ?? 0) + 1,
      });
    }
  }

  return [...authorsById.values()]
    .sort((left, right) => right.booksCount - left.booksCount || left.authorId - right.authorId)
    .slice(0, TOP_AUTHORS_LIMIT)
    .map(({ authorId, fullName, booksCount }, index) => ({
      rank: index + 1,
      author_id: authorId,
      full_name: fullName,
      books_count: booksCount,
    }));
}
