import { getUpdateBookMockHandler } from '@/api/generated/endpoints/books/books.msw';
import { patchBooksIdResolver } from '@/mocks/resolvers/books/patchBooksId';

export const patchBooksIdHandler =
  getUpdateBookMockHandler(patchBooksIdResolver);
