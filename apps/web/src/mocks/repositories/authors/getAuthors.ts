import type { AuthorShort } from '@/api/generated/models';
import { mockDatabase, type MockDatabase } from '@/mocks/db/database';

export interface AuthorsRepository {
  getAll(): Promise<AuthorShort[]>;
}

export class DexieAuthorsRepository implements AuthorsRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async getAll(): Promise<AuthorShort[]> {
    const authorRecords = await this.database.authors.toArray();

    return authorRecords.map(({ id, fullName }) => ({ id, full_name: fullName }));
  }
}

export const authorsRepository = new DexieAuthorsRepository();
