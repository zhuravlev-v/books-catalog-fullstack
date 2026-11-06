import { getDeleteAuthorMockHandler } from '@/api/generated/endpoints/authors/authors.msw';
import { deleteAuthorsIdResolver } from '@/mocks/resolvers/authors/deleteAuthorsId';

export const deleteAuthorsIdHandler = getDeleteAuthorMockHandler(
  deleteAuthorsIdResolver
);
