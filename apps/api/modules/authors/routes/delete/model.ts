import * as z from 'zod';
import { DeleteAuthorParams } from '@books/api-contract/schemas';

import { HttpError } from '../../../../http/errors.ts';
import { prisma } from '../../../../prisma/prisma-client.ts';

type DeleteAuthorPath = z.output<typeof DeleteAuthorParams>;

export async function deleteAuthor(params: DeleteAuthorPath): Promise<void> {
  await prisma.$transaction(async (transaction) => {
    const author = await transaction.authors.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (author === null) {
      throw new HttpError(404, [
        { message: `Author with id ${params.id} not found` },
      ]);
    }

    await transaction.authors.delete({ where: { id: params.id } });
  });
}
