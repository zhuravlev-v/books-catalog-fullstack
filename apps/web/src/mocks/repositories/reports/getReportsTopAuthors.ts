import { mockDatabase, type MockDatabase } from '@/mocks/db/database';

export interface TopAuthorsReportAuthor {
  id: number;
  fullName: string;
}

export interface TopAuthorsReportBook {
  year: number;
  authors: TopAuthorsReportAuthor[];
}

export interface TopAuthorsRepository {
  getBooksWithAuthors(): Promise<TopAuthorsReportBook[]>;
}

export class DexieTopAuthorsRepository implements TopAuthorsRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async getBooksWithAuthors(): Promise<TopAuthorsReportBook[]> {
    return this.database.transaction(
      'r',
      [this.database.books, this.database.authors, this.database.bookAuthors],
      async () => {
        const [bookRecords, authorRecords, bookAuthorRecords] = await Promise.all([
          this.database.books.toArray(),
          this.database.authors.toArray(),
          this.database.bookAuthors.toArray(),
        ]);

        const authorsById = new Map(
          authorRecords.map(({ id, fullName }) => [id, { id, fullName }])
        );
        const authorIdsByBookId = new Map<number, number[]>();

        for (const { bookId, authorId } of bookAuthorRecords) {
          const authorIds = authorIdsByBookId.get(bookId) ?? [];
          authorIds.push(authorId);
          authorIdsByBookId.set(bookId, authorIds);
        }

        return bookRecords.map(({ id, year }) => ({
          year,
          authors: (authorIdsByBookId.get(id) ?? [])
            .map((authorId) => authorsById.get(authorId))
            .filter((author): author is TopAuthorsReportAuthor => author !== undefined),
        }));
      }
    );
  }
}

export const topAuthorsRepository = new DexieTopAuthorsRepository();
