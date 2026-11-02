import type { Author, BookShort } from '@/api/generated/models';
import { mockDatabase, type MockDatabase } from '@/mocks/db/database';
import type { AuthorRecord } from '@/mocks/db/types';
import type { PutAuthorInput } from '@/mocks/http/authors/putAuthorsId';
import { createAuthorModel } from '@/mocks/shared/authors/model';

export type PutAuthorResult = Author | 'not-found';

export interface PutAuthorsIdRepository {
  put(id: number, input: PutAuthorInput): Promise<PutAuthorResult>;
}

export class DexiePutAuthorsIdRepository implements PutAuthorsIdRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async put(id: number, input: PutAuthorInput): Promise<PutAuthorResult> {
    return this.database.transaction(
      'rw',
      [this.database.authors, this.database.books, this.database.bookAuthors],
      async () => {
        const existingAuthor = await this.database.authors.get(id);

        if (existingAuthor === undefined) {
          return 'not-found' as const;
        }

        const record: AuthorRecord = {
          ...existingAuthor,
          fullName: input.fullName,
        };
        const bookAuthors = await this.database.bookAuthors.where('authorId').equals(id).toArray();
        const bookRecords = await this.database.books.bulkGet(
          bookAuthors.map(({ bookId }) => bookId)
        );
        const books: BookShort[] = bookRecords
          .filter((book) => book !== undefined)
          .map(({ id: bookId, title, year }) => ({ id: bookId, title, year }));

        await this.database.authors.put(record);

        return createAuthorModel(record, books);
      }
    );
  }
}

export const putAuthorsIdRepository = new DexiePutAuthorsIdRepository();
