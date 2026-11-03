CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role = 'user'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE authors (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name TEXT NOT NULL
);

CREATE INDEX authors_full_name_idx ON authors(full_name);

CREATE TABLE books (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  description TEXT NOT NULL,
  isbn TEXT NOT NULL,
  cover BYTEA,
  cover_mime_type TEXT,
  CONSTRAINT books_cover_consistency_check CHECK (
    (cover IS NULL AND cover_mime_type IS NULL)
    OR
    (
      cover IS NOT NULL
      AND cover_mime_type IS NOT NULL
      AND cover_mime_type IN ('image/png', 'image/jpeg', 'image/svg+xml')
    )
  )
);

CREATE INDEX books_title_idx ON books(title);
CREATE INDEX books_year_idx ON books(year);
CREATE INDEX books_isbn_idx ON books(isbn);

CREATE TABLE book_authors (
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, author_id)
);

CREATE INDEX book_authors_author_id_idx ON book_authors(author_id);
