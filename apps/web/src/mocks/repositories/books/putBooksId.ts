import type { Book } from '@/api/generated/models';
import { revokeBookCoverUrl } from '@/mocks/db/covers';
import { mockDatabase, type MockDatabase } from '@/mocks/db/database';
import type { BookRecord } from '@/mocks/db/types';
import type { PutBookInput } from '@/mocks/http/books/putBooksId';
import { createBookModel, getBookAuthors } from '@/mocks/shared/books/mutation';

export type PutBookResult = Book | 'not-found';

export interface PutBooksIdRepository {
  put(id: number, input: PutBookInput): Promise<PutBookResult>;
}

export class DexiePutBooksIdRepository implements PutBooksIdRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async put(id: number, input: PutBookInput): Promise<PutBookResult> {
    const result = await this.database.transaction(
      'rw',
      [this.database.books, this.database.authors, this.database.bookAuthors],
      async () => {
        const existingBook = await this.database.books.get(id);

        if (existingBook === undefined) {
          return 'not-found' as const;
        }

        const authors = await getBookAuthors(this.database.authors, input.authorIds);
        const record: BookRecord = {
          id,
          title: input.title,
          year: input.year,
          description: input.description ?? '',
          isbn: input.isbn ?? '',
          cover: input.cover,
        };

        await this.database.books.put(record);
        await this.database.bookAuthors.where('bookId').equals(id).delete();
        await this.database.bookAuthors.bulkAdd(
          input.authorIds.map((authorId) => ({ bookId: id, authorId }))
        );

        return { record, authors };
      }
    );

    if (result === 'not-found') {
      return result;
    }

    revokeBookCoverUrl(id);

    return createBookModel(result.record, result.authors);
  }
}

export const putBooksIdRepository = new DexiePutBooksIdRepository();
