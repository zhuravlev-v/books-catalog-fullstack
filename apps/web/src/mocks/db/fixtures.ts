import { faker } from '@faker-js/faker/locale/ru';

import type { AuthorRecord, BookAuthorRecord, BookRecord, UserRecord } from './types';

const MOCK_DATA_SEED = 20260918;
const AUTHORS_COUNT = 12;
const BOOKS_COUNT = 36;
const PUBLICATION_YEARS = [2022, 2023, 2024, 2025, 2026] as const;

export interface MockDatabaseFixtures {
  users: UserRecord[];
  authors: AuthorRecord[];
  books: BookRecord[];
  bookAuthors: BookAuthorRecord[];
}

function createCover(bookId: number): Blob {
  const hue = (bookId * 47) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000s/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="hsl(${hue} 45% 35%)"/><text x="160" y="240" fill="white" font-family="sans-serif" font-size="32" text-anchor="middle">Книга ${bookId}</text></svg>`;

  return new Blob([svg], { type: 'image/svg+xml' });
}

export function createMockDatabaseFixtures(): MockDatabaseFixtures {
  faker.seed(MOCK_DATA_SEED);

  const users: UserRecord[] = [
    {
      id: '00000000-0000-4000-8000-000000000001',
      username: 'demo',
      email: 'demo@example.com',
      password: 'demo123',
      role: 'user',
      createdAt: '2026-09-18T00:00:00.000Z',
    },
  ];

  const authors: AuthorRecord[] = Array.from({ length: AUTHORS_COUNT }, (_, index) => ({
    id: index + 1,
    fullName: faker.person.fullName(),
  }));

  const books: BookRecord[] = Array.from({ length: BOOKS_COUNT }, (_, index) => {
    const id = index + 1;

    return {
      id,
      title: faker.book.title(),
      year: PUBLICATION_YEARS[index % PUBLICATION_YEARS.length]!,
      description: faker.lorem.paragraph(),
      isbn: faker.commerce.isbn(13),
      cover: createCover(id),
    };
  });

  const authorIds = authors.map(({ id }) => id);
  const bookAuthors = books.flatMap(({ id: bookId }, index) => {
    const authorsCount = index === 0 ? 2 : faker.number.int({ min: 1, max: 3 });

    return faker.helpers.arrayElements(authorIds, authorsCount).map((authorId) => ({
      bookId,
      authorId,
    }));
  });

  return { users, authors, books, bookAuthors };
}
