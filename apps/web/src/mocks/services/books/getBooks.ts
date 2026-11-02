import type { Book } from '@/api/generated/models';
import type { GetBooksQuery } from '@/mocks/http/books/getBooks';

export interface BooksPage {
  items: Book[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export function getBooksPage(books: Book[], query: GetBooksQuery): BooksPage {
  const normalizedSearch = query.search?.toLocaleLowerCase('ru-RU');

  const filteredBooks = books
    .filter((book) => query.year === undefined || book.year === query.year)
    .filter(
      (book) =>
        query.authorId === undefined ||
        book.authors?.some((author) => author.id === query.authorId) === true
    )
    .filter(
      (book) =>
        normalizedSearch === undefined ||
        book.title?.toLocaleLowerCase('ru-RU').includes(normalizedSearch) === true
    )
    .sort((left, right) => (left.id ?? 0) - (right.id ?? 0));

  const total = filteredBooks.length;
  const startIndex = (query.page - 1) * query.perPage;

  return {
    items: filteredBooks.slice(startIndex, startIndex + query.perPage),
    pagination: {
      total,
      page: query.page,
      per_page: query.perPage,
      total_pages: Math.ceil(total / query.perPage),
    },
  };
}
