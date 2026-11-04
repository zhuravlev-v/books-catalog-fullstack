import * as z from 'zod';
import { GetBooksIdParams } from '@books/api-contract/schemas';
import { HttpError } from '../../../http/errors.ts';
import { prisma } from '../../../prisma/prisma-client.ts';
import { bookWithAuthors, type BookWithAuthors } from '../shared/prisma.ts';

export async function queryBook(
  params: z.infer<typeof GetBooksIdParams>
): Promise<BookWithAuthors> {
  const book = await prisma.books.findUnique({
    where: { id: params.id },
    include: bookWithAuthors,
  });

  if (book === null) {
    throw new HttpError(404, [
      {
        message: `Book with id ${params.id} not found`,
      },
    ]);
  }

  return book;
}
