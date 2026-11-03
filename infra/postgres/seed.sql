BEGIN;

INSERT INTO users (
  id,
  username,
  email,
  password,
  role,
  created_at
)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'demo',
  'demo@example.com',
  'demo123',
  'user',
  '2026-09-18T00:00:00Z'
);

INSERT INTO authors (id, full_name)
OVERRIDING SYSTEM VALUE
VALUES
  (1, 'Лев Толстой'),
  (2, 'Фёдор Достоевский'),
  (3, 'Антон Чехов');

INSERT INTO books (
  id,
  title,
  year,
  description,
  isbn
)
OVERRIDING SYSTEM VALUE
VALUES
  (1, 'Война и мир', 2022, 'Исторический роман.', '9785170901234'),
  (2, 'Преступление и наказание', 2023, 'Роман.', '9785170905676');

INSERT INTO book_authors (book_id, author_id)
VALUES
  (1, 1),
  (2, 2),
  (2, 3);

SELECT setval(
  pg_get_serial_sequence('authors', 'id'),
  (SELECT MAX(id) FROM authors)
);

SELECT setval(
  pg_get_serial_sequence('books', 'id'),
  (SELECT MAX(id) FROM books)
);

COMMIT;