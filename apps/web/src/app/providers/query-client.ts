import { QueryClient } from '@tanstack/vue-query';
import { isApiError } from '@/api/client/api-error';

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 1 || !isApiError(error)) {
    return false;
  }

  return error.status === 0 || error.status >= 500;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
