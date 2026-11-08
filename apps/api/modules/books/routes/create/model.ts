import * as z from 'zod';
import { CreateBookBody } from '@books/api-contract/schemas';

import type { ObjectStorage } from '../../../../infrastructure/storage/object-storage.ts';
import { S3_DIRECTORIES } from '../../../../infrastructure/storage/s3-directories.ts';
import { HttpError } from '../../../../http/errors.ts';
import { prisma } from '../../../../prisma/prisma-client.ts';
import { bookWithAuthors, type BookWithAuthors } from '../../shared/prisma.ts';
import { deleteObjectBestEffort } from '../../shared/storage-cleanup.ts';

type CreateBookInput = z.output<typeof CreateBookBody>;

export async function createBook(
  input: CreateBookInput,
  storage: ObjectStorage
): Promise<BookWithAuthors> {
  const authorIds = [...new Set(input.author_ids)];
  const authors = await prisma.authors.findMany({
    where: { id: { in: authorIds } },
    select: { id: true },
  });
  const existingAuthorIds = new Set(authors.map(({ id }) => id));
  const missingAuthorIds = authorIds.filter((id) => !existingAuthorIds.has(id));

  if (missingAuthorIds.length > 0) {
    throw new HttpError(422, [
      {
        field: 'author_ids',
        message: `Авторы не найдены: ${missingAuthorIds.join(', ')}`,
      },
    ]);
  }

  const uploadedCover =
    input.cover === undefined
      ? undefined
      : await storage.uploadObject({
          body: new Uint8Array(await input.cover.arrayBuffer()),
          contentType: input.cover.type,
          directory: S3_DIRECTORIES.BOOK_COVERS,
        });

  try {
    return await prisma.$transaction((transaction) =>
      transaction.books.create({
        data: {
          title: input.title,
          year: input.year,
          description: input.description ?? '',
          isbn: input.isbn ?? '',
          cover_key: uploadedCover?.key,
          cover_mime_type: input.cover?.type,
          cover_size: input.cover?.size,
          cover_etag: uploadedCover?.etag,
          book_authors: {
            create: authorIds.map((authorId) => ({
              authors: { connect: { id: authorId } },
            })),
          },
        },
        include: bookWithAuthors,
      })
    );
  } catch (error) {
    if (uploadedCover !== undefined) {
      await deleteObjectBestEffort(
        storage,
        uploadedCover.key,
        'delete cover after failed book creation'
      );
    }

    throw error;
  }
}
