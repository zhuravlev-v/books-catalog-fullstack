import { mockDatabase, type MockDatabase } from '@/mocks/db/database';

export type DeleteAuthorResult = 'deleted' | 'not-found';

export interface DeleteAuthorsIdRepository {
  deleteById(id: number): Promise<DeleteAuthorResult>;
}

export class DexieDeleteAuthorsIdRepository implements DeleteAuthorsIdRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async deleteById(id: number): Promise<DeleteAuthorResult> {
    return this.database.transaction(
      'rw',
      [this.database.authors, this.database.bookAuthors],
      async (): Promise<DeleteAuthorResult> => {
        const author = await this.database.authors.get(id);

        if (author === undefined) {
          return 'not-found';
        }

        await this.database.bookAuthors.where('authorId').equals(id).delete();
        await this.database.authors.delete(id);

        return 'deleted';
      }
    );
  }
}

export const deleteAuthorsIdRepository = new DexieDeleteAuthorsIdRepository();
