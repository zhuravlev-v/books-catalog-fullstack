CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_role_check" CHECK ("role" = 'user')
);

CREATE TABLE "authors" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY,
    "full_name" TEXT NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "books" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "cover" BYTEA,
    "cover_mime_type" TEXT,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "books_cover_consistency_check" CHECK (
        ("cover" IS NULL AND "cover_mime_type" IS NULL)
        OR
        (
            "cover" IS NOT NULL
            AND "cover_mime_type" IS NOT NULL
            AND "cover_mime_type" IN ('image/png', 'image/jpeg', 'image/svg+xml')
        )
    )
);

CREATE TABLE "book_authors" (
    "book_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "book_authors_pkey" PRIMARY KEY ("book_id", "author_id")
);

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE INDEX "authors_full_name_idx" ON "authors"("full_name");

CREATE INDEX "books_title_idx" ON "books"("title");

CREATE INDEX "books_year_idx" ON "books"("year");

CREATE INDEX "books_isbn_idx" ON "books"("isbn");

CREATE INDEX "book_authors_author_id_idx" ON "book_authors"("author_id");

ALTER TABLE "book_authors"
ADD CONSTRAINT "book_authors_book_id_fkey"
FOREIGN KEY ("book_id") REFERENCES "books"("id")
ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "book_authors"
ADD CONSTRAINT "book_authors_author_id_fkey"
FOREIGN KEY ("author_id") REFERENCES "authors"("id")
ON DELETE CASCADE ON UPDATE NO ACTION;
