import { getGetBooksMockHandler } from '@/api/generated/endpoints/books/books.msw';
import { getBooksResolver } from '@/mocks/resolvers/books/getBooks';

export const getBooksHandler = getGetBooksMockHandler(getBooksResolver);
