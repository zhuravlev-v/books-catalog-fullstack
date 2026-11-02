import type { Book } from '@/api/generated/models';
import { mockDatabase, type MockDatabase } from '@/mocks/db/database';
import type { BookRecord } from '@/mocks/db/types';
import type { PatchBookInput } from '@/mocks/http/books/patchBooksId';
import { createBookModel, getBookAuthors } from '@/mocks/shared/books/mutation';

export type PatchBookResult = Book | 'not-found';

export interface PatchBooksIdRepository {
  patch(id: number, input: PatchBookInput): Promise<PatchBookResult>;
}

export class DexiePatchBooksIdRepository implements PatchBooksIdRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async patch(id: number, input: PatchBookInput): Promise<PatchBookResult> {
    const result = await this.database.transaction(
      'rw',
      [this.database.books, this.database.authors, this.database.bookAuthors],
      async () => {
        const existingBook = await this.database.books.get(id);

        if (existingBook === undefined) {
          return 'not-found' as const;
        }

        const currentBookAuthors = await this.database.bookAuthors
          .where('bookId')
          .equals(id)
          .toArray();
        const authorIds = input.authorIds ?? currentBookAuthors.map(({ authorId }) => authorId);
        const authors = await getBookAuthors(this.database.authors, authorIds);
        const record: BookRecord = {
          ...existingBook,
          ...(input.title === undefined ? {} : { title: input.title }),
          ...(input.year === undefined ? {} : { year: input.year }),
          ...(input.description === undefined ? {} : { description: input.description }),
          ...(input.isbn === undefined ? {} : { isbn: input.isbn }),
        };

        await this.database.books.put(record);

        if (input.authorIds !== undefined) {
          await this.database.bookAuthors.where('bookId').equals(id).delete();
          await this.database.bookAuthors.bulkAdd(
            input.authorIds.map((authorId) => ({ bookId: id, authorId }))
          );
        }

        return { record, authors };
      }
    );

    return result === 'not-found' ? result : createBookModel(result.record, result.authors);
  }
}

export const patchBooksIdRepository = new DexiePatchBooksIdRepository();
