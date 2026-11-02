import { getGetAuthorsMockHandler } from '@/api/generated/endpoints/authors/authors.msw';
import { getAuthorsResolver } from '@/mocks/resolvers/authors/getAuthors';

export const getAuthorsHandler = getGetAuthorsMockHandler(getAuthorsResolver);
