import { mockDatabase, type MockDatabase } from './database';
import { createMockDatabaseFixtures } from './fixtures';

export async function seedMockDatabase(database: MockDatabase = mockDatabase): Promise<void> {
  await database.transaction(
    'rw',
    [database.users, database.authors, database.books, database.bookAuthors],
    async () => {
      const recordCounts = await Promise.all([
        database.users.count(),
        database.authors.count(),
        database.books.count(),
        database.bookAuthors.count(),
      ]);

      if (recordCounts.some((count) => count > 0)) {
        return;
      }

      const { users, authors, books, bookAuthors } = createMockDatabaseFixtures();

      await database.users.bulkAdd(users);
      await database.authors.bulkAdd(authors);
      await database.books.bulkAdd(books);
      await database.bookAuthors.bulkAdd(bookAuthors);
    }
  );
}
