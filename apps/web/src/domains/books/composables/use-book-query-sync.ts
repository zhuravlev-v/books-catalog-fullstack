import { useQueryClient, type QueryKey } from '@tanstack/vue-query';
import {
  getGetAuthorsQueryKey,
  getGetBooksIdQueryKey,
  getGetBooksQueryKey,
  getGetReportsTopAuthorsQueryKey,
} from '@/api/generated/endpoints';

function startsWith(queryKey: QueryKey, prefix: QueryKey): boolean {
  return prefix.every((part, index) => queryKey[index] === part);
}

export function useBookQuerySync() {
  const queryClient = useQueryClient();
  const booksPrefix = getGetBooksQueryKey();
  const authorsPrefix = getGetAuthorsQueryKey();
  const topAuthorsPrefix = getGetReportsTopAuthorsQueryKey();

  function invalidateBookLists() {
    return queryClient.invalidateQueries(
      {
        predicate: ({ queryKey }) => {
          if (!startsWith(queryKey, booksPrefix)) {
            return false;
          }

          const suffix = queryKey[booksPrefix.length];
          return suffix === undefined || typeof suffix === 'object';
        },
      },
      { throwOnError: true },
    );
  }

  function invalidateRelatedQueries() {
    return Promise.all([
      queryClient.invalidateQueries(
        { queryKey: authorsPrefix },
        { throwOnError: true },
      ),
      queryClient.invalidateQueries(
        { queryKey: topAuthorsPrefix },
        { throwOnError: true },
      ),
    ]);
  }

  async function afterCreate() {
    await Promise.all([invalidateBookLists(), invalidateRelatedQueries()]);
  }

  async function afterUpdate(bookId: number) {
    await Promise.all([
      invalidateBookLists(),
      queryClient.invalidateQueries(
        { queryKey: getGetBooksIdQueryKey(bookId), exact: true },
        { throwOnError: true },
      ),
      invalidateRelatedQueries(),
    ]);
  }

  async function afterDelete(bookId: number) {
    const detailKey = getGetBooksIdQueryKey(bookId);

    await queryClient.cancelQueries({ queryKey: detailKey, exact: true });
    queryClient.removeQueries({ queryKey: detailKey, exact: true });
    await Promise.all([invalidateBookLists(), invalidateRelatedQueries()]);
  }

  return { afterCreate, afterUpdate, afterDelete };
}
