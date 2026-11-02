import { getPostAuthorsMockHandler } from '@/api/generated/endpoints/authors/authors.msw';
import { postAuthorsResolver } from '@/mocks/resolvers/authors/postAuthors';

export const postAuthorsHandler = getPostAuthorsMockHandler(postAuthorsResolver);
