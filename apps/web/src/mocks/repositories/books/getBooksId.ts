import type { AuthorShort, Book } from '@/api/generated/models';
import { getBookCoverUrl } from '@/mocks/db/covers';
import { mockDatabase, type MockDatabase } from '@/mocks/db/database';

export interface GetBooksIdRepository {
  getById(id: number): Promise<Book | undefined>;
}

export class DexieGetBooksIdRepository implements GetBooksIdRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  async getById(id: number): Promise<Book | undefined> {
    return this.database.transaction(
      'r',
      [this.database.books, this.database.authors, this.database.bookAuthors],
      async () => {
        const book = await this.database.books.get(id);

        if (book === undefined) {
          return undefined;
        }

        const bookAuthors = await this.database.bookAuthors.where('bookId').equals(id).toArray();
        const authorRecords = await this.database.authors.bulkGet(
          bookAuthors.map(({ authorId }) => authorId)
        );
        const authors: AuthorShort[] = authorRecords
          .filter((author) => author !== undefined)
          .map(({ id: authorId, fullName }) => ({ id: authorId, full_name: fullName }));

        return {
          id: book.id,
          title: book.title,
          year: book.year,
          description: book.description,
          isbn: book.isbn,
          cover_url: getBookCoverUrl(book.id, book.cover),
          authors,
        };
      }
    );
  }
}

export const getBooksIdRepository = new DexieGetBooksIdRepository();
