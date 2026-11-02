import { mockDatabase, type MockDatabase } from './database';
import { revokeAllBookCoverUrls } from './covers';
import { createMockDatabaseFixtures } from './fixtures';

export async function resetMockDatabase(database: MockDatabase = mockDatabase): Promise<void> {
  revokeAllBookCoverUrls();

  await database.transaction(
    'rw',
    [database.users, database.authors, database.books, database.bookAuthors],
    async () => {
      await Promise.all([
        database.users.clear(),
        database.authors.clear(),
        database.books.clear(),
        database.bookAuthors.clear(),
      ]);

      const { users, authors, books, bookAuthors } = createMockDatabaseFixtures();

      await database.users.bulkAdd(users);
      await database.authors.bulkAdd(authors);
      await database.books.bulkAdd(books);
      await database.bookAuthors.bulkAdd(bookAuthors);
    }
  );
}
