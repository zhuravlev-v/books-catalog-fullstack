<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useTopAuthorsRating } from '@/domains/reports/composables/use-top-authors-rating';
import { PageState } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';

const { year, query } = useTopAuthorsRating();

const report = computed(() => query.data.value?.data.data);
const authors = computed(() => report.value?.items ?? []);
const reportYear = computed(() => report.value?.year ?? year);
</script>

<template>
  <Skeleton
    v-if="query.isPending.value"
    class="h-72 w-full rounded-xl"
    aria-label="Загрузка рейтинга авторов"
  />

  <PageState
    v-else-if="query.isError.value"
    title="Не удалось загрузить рейтинг"
    description="Попробуйте повторить запрос позже."
  >
    <template #action>
      <Button :disabled="query.isFetching.value" @click="query.refetch()">
        {{ query.isFetching.value ? 'Загрузка…' : 'Повторить' }}
      </Button>
    </template>
  </PageState>

  <PageState
    v-else-if="authors.length === 0"
    title="Рейтинг пока пуст"
    :description="`За ${year} год данные об авторах отсутствуют.`"
  />

  <section v-else class="min-w-0 space-y-3" aria-labelledby="top-authors-title">
    <h2 id="top-authors-title" class="text-lg font-semibold">Рейтинг за {{ reportYear }} год</h2>

    <ol class="space-y-3">
      <li
        v-for="(author, index) in authors"
        :key="author.author_id ?? `${author.full_name ?? 'author'}-${index}`"
        class="grid min-w-0 gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center"
      >
        <span class="text-sm font-medium text-muted-foreground">
          {{ author.rank == null ? 'Место не указано' : `${author.rank} место` }}
        </span>

        <RouterLink
          v-if="author.author_id !== undefined"
          :to="{ name: 'author-details', params: { id: author.author_id } }"
          class="min-w-0 w-fit break-words font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {{ author.full_name || 'Автор не указан' }}
        </RouterLink>
        <span v-else class="min-w-0 break-words font-medium">
          {{ author.full_name || 'Автор не указан' }}
        </span>

        <span class="text-sm sm:text-right">
          {{
            author.books_count == null
              ? 'Количество книг не указано'
              : `Книг: ${author.books_count}`
          }}
        </span>
      </li>
    </ol>
  </section>
</template>
