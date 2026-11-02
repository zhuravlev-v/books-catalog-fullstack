import { getPostBooksMockHandler } from '@/api/generated/endpoints/books/books.msw';
import { postBooksResolver } from '@/mocks/resolvers/books/postBooks';

export const postBooksHandler = getPostBooksMockHandler(postBooksResolver);
