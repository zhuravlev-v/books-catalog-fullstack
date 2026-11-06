import { getDeleteBookMockHandler } from '@/api/generated/endpoints/books/books.msw';
import { deleteBooksIdResolver } from '@/mocks/resolvers/books/deleteBooksId';

export const deleteBooksIdHandler = getDeleteBookMockHandler(
  deleteBooksIdResolver
);
