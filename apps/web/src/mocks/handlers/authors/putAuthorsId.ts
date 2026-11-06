import { getUpdateAuthorMockHandler } from '@/api/generated/endpoints/authors/authors.msw';
import { putAuthorsIdResolver } from '@/mocks/resolvers/authors/putAuthorsId';

export const putAuthorsIdHandler =
  getUpdateAuthorMockHandler(putAuthorsIdResolver);
