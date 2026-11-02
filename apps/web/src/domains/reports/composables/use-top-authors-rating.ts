import { useGetReportsTopAuthors } from '@/api/generated/endpoints';

export function useTopAuthorsRating() {
  const year = new Date().getFullYear();
  const query = useGetReportsTopAuthors({ year });

  return {
    year,
    query,
  };
}
