import type { Book } from '@/api/generated/models';
import { mockDatabase, type MockDatabase } from '@/mocks/db/database';
import type { BookRecord } from '@/mocks/db/types';
import type { CreateBookInput } from '@/mocks/http/books/postBooks';
import { createBookModel, getBookAuthors } from '@/mocks/shared/books/mutation';

export interface PostBooksRepository {
  create(input: CreateBookInput): Promise<Book>;
}

export class DexiePostBooksRepository implements PostBooksRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async create(input: CreateBookInput): Promise<Book> {
    const { record, authors } = await this.database.transaction(
      'rw',
      [this.database.books, this.database.authors, this.database.bookAuthors],
      async () => {
        const authors = await getBookAuthors(this.database.authors, input.authorIds);

        const lastBook = await this.database.books.orderBy('id').last();
        const id = (lastBook?.id ?? 0) + 1;
        const record: BookRecord = {
          id,
          title: input.title,
          year: input.year,
          description: input.description ?? '',
          isbn: input.isbn ?? '',
          cover: input.cover,
        };
        await this.database.books.add(record);
        await this.database.bookAuthors.bulkAdd(
          input.authorIds.map((authorId) => ({ bookId: id, authorId }))
        );

        return { record, authors };
      }
    );

    return createBookModel(record, authors);
  }
}

export const postBooksRepository = new DexiePostBooksRepository();
