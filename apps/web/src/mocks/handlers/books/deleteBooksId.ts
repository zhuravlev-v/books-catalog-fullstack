import { getDeleteBooksIdMockHandler } from '@/api/generated/endpoints/books/books.msw';
import { deleteBooksIdResolver } from '@/mocks/resolvers/books/deleteBooksId';

export const deleteBooksIdHandler = getDeleteBooksIdMockHandler(deleteBooksIdResolver);
