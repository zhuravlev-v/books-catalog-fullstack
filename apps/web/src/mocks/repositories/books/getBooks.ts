import type { AuthorShort, Book } from '@/api/generated/models';
import { getBookCoverUrl } from '@/mocks/db/covers';
import { mockDatabase, type MockDatabase } from '@/mocks/db/database';

export interface BooksRepository {
  getAll(): Promise<Book[]>;
}

export class DexieBooksRepository implements BooksRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async getAll(): Promise<Book[]> {
    return this.database.transaction(
      'r',
      [this.database.books, this.database.authors, this.database.bookAuthors],
      async () => {
        const [bookRecords, authorRecords, bookAuthorRecords] = await Promise.all([
          this.database.books.toArray(),
          this.database.authors.toArray(),
          this.database.bookAuthors.toArray(),
        ]);

        const authorsById = new Map<number, AuthorShort>(
          authorRecords.map(({ id, fullName }) => [id, { id, full_name: fullName }])
        );
        const authorIdsByBookId = new Map<number, Set<number>>();

        for (const { bookId, authorId } of bookAuthorRecords) {
          const authorIds = authorIdsByBookId.get(bookId) ?? new Set<number>();
          authorIds.add(authorId);
          authorIdsByBookId.set(bookId, authorIds);
        }

        return bookRecords.map(({ id, title, year, description, isbn, cover }) => {
          const authors = [...(authorIdsByBookId.get(id) ?? [])]
            .map((authorId) => authorsById.get(authorId))
            .filter((author): author is AuthorShort => author !== undefined);

          return {
            id,
            title,
            year,
            description,
            isbn,
            cover_url: getBookCoverUrl(id, cover),
            authors,
          };
        });
      }
    );
  }
}

export const booksRepository = new DexieBooksRepository();
