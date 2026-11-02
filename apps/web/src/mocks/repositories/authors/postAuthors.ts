import type { Author } from '@/api/generated/models';
import { mockDatabase, type MockDatabase } from '@/mocks/db/database';
import type { AuthorRecord } from '@/mocks/db/types';
import type { CreateAuthorInput } from '@/mocks/http/authors/postAuthors';
import { createAuthorModel } from '@/mocks/shared/authors/model';

export interface PostAuthorsRepository {
  create(input: CreateAuthorInput): Promise<Author>;
}

export class DexiePostAuthorsRepository implements PostAuthorsRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async create(input: CreateAuthorInput): Promise<Author> {
    return this.database.transaction('rw', this.database.authors, async () => {
      const lastAuthor = await this.database.authors.orderBy('id').last();
      const record: AuthorRecord = {
        id: (lastAuthor?.id ?? 0) + 1,
        fullName: input.fullName,
      };

      await this.database.authors.add(record);

      return createAuthorModel(record, []);
    });
  }
}

export const postAuthorsRepository = new DexiePostAuthorsRepository();
