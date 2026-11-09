import { AuthorListResponse as AuthorListResponseSchema } from '@books/api-contract/schemas';

import { defineMapper } from '../../../../http/mapper.ts';
import type { AuthorsPage } from './model.ts';

export const authorsListDto = defineMapper(
  AuthorListResponseSchema,
  (authorsPage: AuthorsPage) => ({
    success: true as const,
    data: {
      items: authorsPage.items,
      pagination: {
        total: authorsPage.total,
        page: authorsPage.page,
        per_page: authorsPage.perPage,
        total_pages: Math.ceil(authorsPage.total / authorsPage.perPage),
      },
    },
  })
);
