import * as z from 'zod';
import { GetAuthorsIdParams } from '@books/api-contract/schemas';

import { HttpError } from '../../../../http/errors.ts';
import { prisma } from '../../../../prisma/prisma-client.ts';
import { authorWithBooks, type AuthorWithBooks } from '../../shared/prisma.ts';

type GetAuthorPath = z.output<typeof GetAuthorsIdParams>;

export async function queryAuthor(
  params: GetAuthorPath
): Promise<AuthorWithBooks> {
  const author = await prisma.authors.findUnique({
    where: { id: params.id },
    include: authorWithBooks,
  });

  if (author === null) {
    throw new HttpError(404, [
      { message: `Author with id ${params.id} not found` },
    ]);
  }

  return author;
}
