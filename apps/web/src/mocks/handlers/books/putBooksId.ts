import { getPutBooksIdMockHandler } from '@/api/generated/endpoints/books/books.msw';
import { putBooksIdResolver } from '@/mocks/resolvers/books/putBooksId';

export const putBooksIdHandler = getPutBooksIdMockHandler(putBooksIdResolver);
