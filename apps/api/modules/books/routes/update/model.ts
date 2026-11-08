import * as z from 'zod';
import { UpdateBookBody, UpdateBookParams } from '@books/api-contract/schemas';

import type { Prisma } from '../../../../generated/prisma/client.ts';
import type { ObjectStorage } from '../../../../infrastructure/storage/object-storage.ts';
import { S3_DIRECTORIES } from '../../../../infrastructure/storage/s3-directories.ts';
import { HttpError } from '../../../../http/errors.ts';
import { prisma } from '../../../../prisma/prisma-client.ts';
import { omitUndefined } from '../../shared/omit-undefined.ts';
import { bookWithAuthors, type BookWithAuthors } from '../../shared/prisma.ts';
import { deleteObjectBestEffort } from '../../shared/storage-cleanup.ts';

type UpdateBookInput = z.output<typeof UpdateBookBody>;
type UpdateBookPath = z.output<typeof UpdateBookParams>;

export async function updateBook(
  params: UpdateBookPath,
  input: UpdateBookInput,
  storage: ObjectStorage
): Promise<BookWithAuthors> {
  const uploadedCover =
    input.cover === undefined
      ? undefined
      : await storage.uploadObject({
          body: new Uint8Array(await input.cover.arrayBuffer()),
          contentType: input.cover.type,
          directory: S3_DIRECTORIES.BOOK_COVERS,
        });

  let previousCoverKey: string | null = null;

  try {
    const book = await prisma.$transaction(async (transaction) => {
      const existingBook = await transaction.books.findUnique({
        where: { id: params.id },
        select: { cover_key: true },
      });

      if (existingBook === null) {
        throw new HttpError(404, [
          { message: `Book with id ${params.id} not found` },
        ]);
      }

      previousCoverKey = existingBook.cover_key;

      const authorIds =
        input.author_ids === undefined
          ? undefined
          : [...new Set(input.author_ids)];

      if (authorIds !== undefined) {
        const authors = await transaction.authors.findMany({
          where: { id: { in: authorIds } },
          select: { id: true },
        });
        const existingAuthorIds = new Set(authors.map(({ id }) => id));
        const missingAuthorIds = authorIds.filter(
          (id) => !existingAuthorIds.has(id)
        );

        if (missingAuthorIds.length > 0) {
          throw new HttpError(422, [
            {
              field: 'author_ids',
              message: `Авторы не найдены: ${missingAuthorIds.join(', ')}`,
            },
          ]);
        }
      }

      const data: Prisma.booksUpdateInput = omitUndefined({
        title: input.title,
        year: input.year,
        description: input.description,
        isbn: input.isbn,
      });

      if (uploadedCover !== undefined) {
        Object.assign(
          data,
          omitUndefined({
            cover_key: uploadedCover.key,
            cover_mime_type: input.cover?.type,
            cover_size: input.cover?.size,
            cover_etag: uploadedCover.etag,
          })
        );
      } else if (input.remove_cover === true) {
        Object.assign(data, {
          cover_key: null,
          cover_mime_type: null,
          cover_size: null,
          cover_etag: null,
        });
      }

      if (authorIds !== undefined) {
        data.book_authors = {
          deleteMany: {},
          create: authorIds.map((authorId) => ({
            authors: { connect: { id: authorId } },
          })),
        };
      }

      return transaction.books.update({
        where: { id: params.id },
        data,
        include: bookWithAuthors,
      });
    });

    if (
      previousCoverKey !== null &&
      (uploadedCover !== undefined || input.remove_cover === true)
    ) {
      await deleteObjectBestEffort(
        storage,
        previousCoverKey,
        'delete replaced book cover'
      );
    }

    return book;
  } catch (error) {
    if (uploadedCover !== undefined) {
      await deleteObjectBestEffort(
        storage,
        uploadedCover.key,
        'delete cover after failed book update'
      );
    }

    throw error;
  }
}
