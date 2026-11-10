import * as z from 'zod';
import {
  UpdateAuthorBody,
  UpdateAuthorParams,
} from '@books/api-contract/schemas';

import { HttpError } from '../../../../http/errors.ts';
import { prisma } from '../../../../prisma/prisma-client.ts';
import { authorWithBooks, type AuthorWithBooks } from '../../shared/prisma.ts';

type UpdateAuthorInput = z.output<typeof UpdateAuthorBody>;
type UpdateAuthorPath = z.output<typeof UpdateAuthorParams>;

export async function updateAuthor(
  params: UpdateAuthorPath,
  input: UpdateAuthorInput
): Promise<AuthorWithBooks> {
  return prisma.$transaction(async (transaction) => {
    const author = await transaction.authors.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (author === null) {
      throw new HttpError(404, [
        { message: `Author with id ${params.id} not found` },
      ]);
    }

    return transaction.authors.update({
      where: { id: params.id },
      data: input,
      include: authorWithBooks,
    });
  });
}
