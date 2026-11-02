import { revokeBookCoverUrl } from '@/mocks/db/covers';
import { mockDatabase, type MockDatabase } from '@/mocks/db/database';

export type DeleteBookResult = 'deleted' | 'not-found';

export interface DeleteBooksIdRepository {
  deleteById(id: number): Promise<DeleteBookResult>;
}

export class DexieDeleteBooksIdRepository implements DeleteBooksIdRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async deleteById(id: number): Promise<DeleteBookResult> {
    const result = await this.database.transaction(
      'rw',
      [this.database.books, this.database.bookAuthors],
      async (): Promise<DeleteBookResult> => {
        const book = await this.database.books.get(id);

        if (book === undefined) {
          return 'not-found';
        }

        await this.database.bookAuthors.where('bookId').equals(id).delete();
        await this.database.books.delete(id);

        return 'deleted';
      }
    );

    if (result === 'deleted') {
      revokeBookCoverUrl(id);
    }

    return result;
  }
}

export const deleteBooksIdRepository = new DexieDeleteBooksIdRepository();
