import { computed, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { onBeforeRouteLeave, useRoute, useRouter, type LocationQueryValue } from 'vue-router';
import { useGetAuthors } from '@/api/generated/endpoints';

const DEFAULT_PAGE = 1;
const AUTHORS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 300;

function getQueryValue(
  value: LocationQueryValue | LocationQueryValue[] | undefined
): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function normalizePage(value: LocationQueryValue | LocationQueryValue[] | undefined): number {
  const rawValue = getQueryValue(value);

  if (rawValue === undefined || !/^\d+$/.test(rawValue)) {
    return DEFAULT_PAGE;
  }

  const page = Number(rawValue);

  return Number.isSafeInteger(page) && page > 0 ? page : DEFAULT_PAGE;
}

function normalizeSearch(
  value: LocationQueryValue | LocationQueryValue[] | undefined
): string | undefined {
  const search = getQueryValue(value)?.trim();

  return search || undefined;
}

export function useAuthorsList() {
  const route = useRoute();
  const router = useRouter();

  const page = computed(() => normalizePage(route.query.page));
  const routeSearch = computed(() => normalizeSearch(route.query.search) ?? '');
  const searchInput = ref(routeSearch.value);

  const params = computed(() => ({
    page: page.value,
    'per-page': AUTHORS_PER_PAGE,
    ...(routeSearch.value ? { search: routeSearch.value } : {}),
  }));
  const query = useGetAuthors(params);

  function setPage(nextPage: number) {
    const normalizedPage = Number.isSafeInteger(nextPage) && nextPage > 0 ? nextPage : DEFAULT_PAGE;
    const pageQuery = normalizedPage === DEFAULT_PAGE ? undefined : String(normalizedPage);

    if (route.query.page === pageQuery) {
      return;
    }

    void router.replace({
      query: {
        ...route.query,
        page: pageQuery,
      },
    });
  }

  const updateSearchQuery = useDebounceFn((value: string) => {
    const normalizedSearch = value.trim() || undefined;

    void router.replace({
      query: {
        ...route.query,
        page: undefined,
        search: normalizedSearch,
      },
    });
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
    }
  );

  onBeforeRouteLeave(() => {
    updateSearchQuery.cancel();
  });

  return {
    page,
    perPage: AUTHORS_PER_PAGE,
    search,
    setPage,
    query,
  };
}
