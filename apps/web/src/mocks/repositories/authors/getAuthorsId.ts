import type { Author, BookShort } from '@/api/generated/models';
import { mockDatabase, type MockDatabase } from '@/mocks/db/database';
import { createAuthorModel } from '@/mocks/shared/authors/model';

export interface GetAuthorsIdRepository {
  getById(id: number): Promise<Author | undefined>;
}

export class DexieGetAuthorsIdRepository implements GetAuthorsIdRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async getById(id: number): Promise<Author | undefined> {
    return this.database.transaction(
      'r',
      [this.database.authors, this.database.books, this.database.bookAuthors],
      async () => {
        const author = await this.database.authors.get(id);

        if (author === undefined) {
          return undefined;
        }

        const bookAuthors = await this.database.bookAuthors.where('authorId').equals(id).toArray();
        const bookRecords = await this.database.books.bulkGet(
          bookAuthors.map(({ bookId }) => bookId)
        );
        const books: BookShort[] = bookRecords
          .filter((book) => book !== undefined)
          .map(({ id: bookId, title, year }) => ({ id: bookId, title, year }));

        return createAuthorModel(author, books);
      }
    );
  }
}

export const getAuthorsIdRepository = new DexieGetAuthorsIdRepository();
