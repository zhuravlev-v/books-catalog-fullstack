import { AuthorResponse as AuthorResponseSchema } from '@books/api-contract/schemas';

import { defineMapper } from '../../../../http/mapper.ts';
import type { AuthorWithBooks } from '../../shared/prisma.ts';
import { presentAuthor } from '../../shared/view.ts';

export const authorDto = defineMapper(
  AuthorResponseSchema,
  (author: AuthorWithBooks) => ({
    success: true as const,
    data: presentAuthor(author),
  })
);
