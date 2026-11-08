import * as z from 'zod';
import { DeleteBookParams } from '@books/api-contract/schemas';

import type { ObjectStorage } from '../../../../infrastructure/storage/object-storage.ts';
import { HttpError } from '../../../../http/errors.ts';
import { prisma } from '../../../../prisma/prisma-client.ts';
import { deleteObjectBestEffort } from '../../shared/storage-cleanup.ts';

type DeleteBookPath = z.output<typeof DeleteBookParams>;

export async function deleteBook(
  params: DeleteBookPath,
  storage: ObjectStorage
): Promise<void> {
  const coverKey = await prisma.$transaction(async (transaction) => {
    const book = await transaction.books.findUnique({
      where: { id: params.id },
      select: { cover_key: true },
    });

    if (book === null) {
      throw new HttpError(404, [
        { message: `Book with id ${params.id} not found` },
      ]);
    }

    await transaction.books.delete({ where: { id: params.id } });

    return book.cover_key;
  });

  if (coverKey !== null) {
    await deleteObjectBestEffort(
      storage,
      coverKey,
      'delete removed book cover'
    );
  }
}
