import { getGetAuthorsIdMockHandler } from '@/api/generated/endpoints/authors/authors.msw';
import { getAuthorsIdResolver } from '@/mocks/resolvers/authors/getAuthorsId';

export const getAuthorsIdHandler = getGetAuthorsIdMockHandler(getAuthorsIdResolver);
