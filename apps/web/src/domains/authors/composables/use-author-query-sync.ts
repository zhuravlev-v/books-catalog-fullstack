import { useQueryClient, type QueryKey } from '@tanstack/vue-query';
import {
  getGetAuthorsIdQueryKey,
  getGetAuthorsQueryKey,
  getGetBooksQueryKey,
  getGetReportsTopAuthorsQueryKey,
} from '@/api/generated/endpoints';

function startsWith(queryKey: QueryKey, prefix: QueryKey): boolean {
  return prefix.every((part, index) => queryKey[index] === part);
}

export function useAuthorQuerySync() {
  const queryClient = useQueryClient();
  const authorsPrefix = getGetAuthorsQueryKey();
  const booksPrefix = getGetBooksQueryKey();
  const topAuthorsPrefix = getGetReportsTopAuthorsQueryKey();

  function invalidateAuthorLists() {
    return queryClient.invalidateQueries(
      {
        predicate: ({ queryKey }) => {
          if (!startsWith(queryKey, authorsPrefix)) {
            return false;
          }

          const suffix = queryKey[authorsPrefix.length];

          return suffix === undefined || typeof suffix === 'object';
        },
      },
      { throwOnError: true },
    );
  }

  function invalidateRelatedQueries() {
    return Promise.all([
      queryClient.invalidateQueries(
        { queryKey: booksPrefix },
        { throwOnError: true },
      ),
      queryClient.invalidateQueries(
        { queryKey: topAuthorsPrefix },
        { throwOnError: true },
      ),
    ]);
  }

  async function afterCreate() {
    await Promise.all([
      invalidateAuthorLists(),
      invalidateRelatedQueries(),
    ]);
  }

  async function afterUpdate(authorId: number) {
    await Promise.all([
      invalidateAuthorLists(),
      queryClient.invalidateQueries(
        { queryKey: getGetAuthorsIdQueryKey(authorId), exact: true },
        { throwOnError: true },
      ),
      invalidateRelatedQueries(),
    ]);
  }

  async function afterDelete(authorId: number) {
    const authorQueryKey = getGetAuthorsIdQueryKey(authorId);

    await queryClient.cancelQueries({ queryKey: authorQueryKey, exact: true });
    queryClient.removeQueries({ queryKey: authorQueryKey, exact: true });

    await Promise.all([
      invalidateAuthorLists(),
      invalidateRelatedQueries(),
    ]);
  }

  return {
    afterCreate,
    afterUpdate,
    afterDelete,
  };
}
