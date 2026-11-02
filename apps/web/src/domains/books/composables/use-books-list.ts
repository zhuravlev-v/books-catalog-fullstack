import { computed, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { onBeforeRouteLeave, useRoute, useRouter, type LocationQueryValue } from 'vue-router';
import { useGetAuthors, useGetBooks } from '@/api/generated/endpoints';

const DEFAULT_PAGE = 1;
const BOOKS_PER_PAGE = 20;
const AUTHORS_PER_PAGE = 100;
const SEARCH_DEBOUNCE_MS = 300;

function getQueryValue(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function normalizePositiveInteger(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): number | undefined {
  const rawValue = getQueryValue(value);

  if (rawValue === undefined || !/^\d+$/.test(rawValue)) {
    return undefined;
  }

  const number = Number(rawValue);

  return Number.isSafeInteger(number) && number > 0 ? number : undefined;
}

function normalizePage(value: LocationQueryValue | LocationQueryValue[] | undefined): number {
  return normalizePositiveInteger(value) ?? DEFAULT_PAGE;
}

function normalizeSearch(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string | undefined {
  return getQueryValue(value)?.trim() || undefined;
}

export function useBooksList() {
  const route = useRoute();
  const router = useRouter();

  const page = computed(() => normalizePage(route.query.page));
  const routeSearch = computed(() => normalizeSearch(route.query.search) ?? '');
  const year = computed(() => normalizePositiveInteger(route.query.year));
  const authorId = computed(() => normalizePositiveInteger(route.query.author_id));
  const searchInput = ref(routeSearch.value);

  const params = computed(() => ({
    page: page.value,
    'per-page': BOOKS_PER_PAGE,
    ...(routeSearch.value ? { search: routeSearch.value } : {}),
    ...(year.value ? { year: year.value } : {}),
    ...(authorId.value ? { author_id: authorId.value } : {}),
  }));
  const query = useGetBooks(params);
  const authorsQuery = useGetAuthors({ page: 1, 'per-page': AUTHORS_PER_PAGE });

  function replaceQuery(changes: Record<string, string | undefined>) {
    void router.replace({
      query: {
        ...route.query,
        ...changes,
      },
    });
  }

  function setPage(nextPage: number) {
    const normalizedPage = Number.isSafeInteger(nextPage) && nextPage > 0 ? nextPage : DEFAULT_PAGE;
    replaceQuery({ page: normalizedPage === DEFAULT_PAGE ? undefined : String(normalizedPage) });
  }

  function setYear(value?: number) {
    replaceQuery({
      page: undefined,
      year: value && Number.isSafeInteger(value) && value > 0 ? String(value) : undefined,
    });
  }

  function setAuthorId(value?: number) {
    replaceQuery({
      page: undefined,
      author_id: value && Number.isSafeInteger(value) && value > 0 ? String(value) : undefined,
    });
  }

  const updateSearchQuery = useDebounceFn((value: string) => {
    replaceQuery({ page: undefined, search: value.trim() || undefined });
  }, SEARCH_DEBOUNCE_MS);

  const search = computed({
    get: () => searchInput.value,
    set: (value: string) => {
      searchInput.value = value;
      updateSearchQuery(value);
    },
  });

  watch(
    () => route.fullPath,
    () => {
      updateSearchQuery.cancel();
      searchInput.value = routeSearch.value;
    },
  );

  onBeforeRouteLeave(() => updateSearchQuery.cancel());

  return {
    page,
    perPage: BOOKS_PER_PAGE,
    search,
    year,
    authorId,
    setPage,
    setYear,
    setAuthorId,
    query,
    authorsQuery,
  };
}
