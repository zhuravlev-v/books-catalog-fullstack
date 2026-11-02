import { getGetBooksIdMockHandler } from '@/api/generated/endpoints/books/books.msw';
import { getBooksIdResolver } from '@/mocks/resolvers/books/getBooksId';

export const getBooksIdHandler = getGetBooksIdMockHandler(getBooksIdResolver);
