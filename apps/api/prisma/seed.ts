import { db } from '../db.ts';

await db.$transaction(async (transaction) => {
  await transaction.$executeRaw`
    INSERT INTO "users" (
      "id",
      "username",
      "email",
      "password",
      "role",
      "created_at"
    )
    VALUES (
      '00000000-0000-4000-8000-000000000001'::uuid,
      'demo',
      'demo@example.com',
      'demo123',
      'user',
      '2026-09-18T00:00:00Z'::timestamptz
    )
    ON CONFLICT ("id") DO UPDATE SET
      "username" = EXCLUDED."username",
      "email" = EXCLUDED."email",
      "password" = EXCLUDED."password",
      "role" = EXCLUDED."role",
      "created_at" = EXCLUDED."created_at"
  `;

  await transaction.$executeRaw`
    INSERT INTO "authors" ("id", "full_name")
    OVERRIDING SYSTEM VALUE
    VALUES
      (1, 'Лев Толстой'),
      (2, 'Фёдор Достоевский'),
      (3, 'Антон Чехов')
    ON CONFLICT ("id") DO UPDATE SET
      "full_name" = EXCLUDED."full_name"
  `;

  await transaction.$executeRaw`
    INSERT INTO "books" (
      "id",
      "title",
      "year",
      "description",
      "isbn"
    )
    OVERRIDING SYSTEM VALUE
    VALUES
      (1, 'Война и мир', 2022, 'Исторический роман.', '9785170901234'),
      (2, 'Преступление и наказание', 2023, 'Роман.', '9785170905676')
    ON CONFLICT ("id") DO UPDATE SET
      "title" = EXCLUDED."title",
      "year" = EXCLUDED."year",
      "description" = EXCLUDED."description",
      "isbn" = EXCLUDED."isbn"
  `;

  await transaction.$executeRaw`
    INSERT INTO "book_authors" ("book_id", "author_id")
    VALUES
      (1, 1),
      (2, 2),
      (2, 3)
    ON CONFLICT ("book_id", "author_id") DO NOTHING
  `;

  await transaction.$queryRaw`
    SELECT setval(
      pg_get_serial_sequence('authors', 'id'),
      (SELECT MAX("id") FROM "authors")
    )
  `;

  await transaction.$queryRaw`
    SELECT setval(
      pg_get_serial_sequence('books', 'id'),
      (SELECT MAX("id") FROM "books")
    )
  `;
}).finally(() => db.$disconnect());
