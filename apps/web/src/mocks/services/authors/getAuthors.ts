import type { AuthorShort } from '@/api/generated/models';
import type { GetAuthorsQuery } from '@/mocks/http/authors/getAuthors';

export interface AuthorsPage {
  items: AuthorShort[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export function getAuthorsPage(authors: AuthorShort[], query: GetAuthorsQuery): AuthorsPage {
  const normalizedSearch = query.search?.toLocaleLowerCase('ru-RU');
  const filteredAuthors = authors
    .filter(
      (author) =>
        normalizedSearch === undefined ||
        author.full_name?.toLocaleLowerCase('ru-RU').includes(normalizedSearch) === true
    )
    .sort((left, right) => (left.id ?? 0) - (right.id ?? 0));
  const total = filteredAuthors.length;
  const startIndex = (query.page - 1) * query.perPage;

  return {
    items: filteredAuthors.slice(startIndex, startIndex + query.perPage),
    pagination: {
      total,
      page: query.page,
      per_page: query.perPage,
      total_pages: Math.ceil(total / query.perPage),
    },
  };
}
