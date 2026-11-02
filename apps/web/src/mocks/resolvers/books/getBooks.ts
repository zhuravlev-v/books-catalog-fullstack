import type { BookListResponse } from '@/api/generated/models';
import { parseGetBooksQuery } from '@/mocks/http/books/getBooks';
import { booksRepository } from '@/mocks/repositories/books/getBooks';
import { getBooksPage } from '@/mocks/services/books/getBooks';

interface GetBooksRequestInfo {
  request: Request;
}

export async function getBooksResolver({
  request,
}: GetBooksRequestInfo): Promise<BookListResponse> {
  const query = parseGetBooksQuery(new URL(request.url).searchParams);
  const books = await booksRepository.getAll();

  return {
    success: true,
    data: getBooksPage(books, query),
  };
}
