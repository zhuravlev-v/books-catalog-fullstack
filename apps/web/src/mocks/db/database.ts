import Dexie, { type Table } from 'dexie';

import type { AuthorRecord, BookAuthorRecord, BookRecord, UserRecord } from './types';

export class MockDatabase extends Dexie {
  users!: Table<UserRecord, string>;
  authors!: Table<AuthorRecord, number>;
  books!: Table<BookRecord, number>;
  bookAuthors!: Table<BookAuthorRecord, [number, number]>;

  constructor() {
    super('bookCatalogMock');

    this.version(1).stores({
      users: 'id, &username, &email',
      authors: 'id, fullName',
      books: 'id, title, year, isbn',
      bookAuthors: '[bookId+authorId], bookId, authorId',
    });
  }
}

export const mockDatabase = new MockDatabase();
