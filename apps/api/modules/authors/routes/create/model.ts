import * as z from 'zod';
import { CreateAuthorBody } from '@books/api-contract/schemas';

import { prisma } from '../../../../prisma/prisma-client.ts';
import { authorWithBooks, type AuthorWithBooks } from '../../shared/prisma.ts';

type CreateAuthorInput = z.output<typeof CreateAuthorBody>;

export async function createAuthor(
  input: CreateAuthorInput
): Promise<AuthorWithBooks> {
  return prisma.authors.create({
    data: input,
    include: authorWithBooks,
  });
}
