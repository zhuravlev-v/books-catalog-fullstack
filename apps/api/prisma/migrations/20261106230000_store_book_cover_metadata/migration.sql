ALTER TABLE "books"
DROP CONSTRAINT "books_cover_consistency_check";

ALTER TABLE "books"
DROP COLUMN "cover",
ADD COLUMN "cover_key" TEXT,
ADD COLUMN "cover_size" INTEGER,
ADD COLUMN "cover_etag" TEXT;

ALTER TABLE "books"
ADD CONSTRAINT "books_cover_metadata_consistency_check" CHECK (
    (
        "cover_key" IS NULL
        AND "cover_mime_type" IS NULL
        AND "cover_size" IS NULL
        AND "cover_etag" IS NULL
    )
    OR
    (
        "cover_key" IS NOT NULL
        AND "cover_mime_type" IS NOT NULL
        AND "cover_size" IS NOT NULL
        AND "cover_size" > 0
    )
);
