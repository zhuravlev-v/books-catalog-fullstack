<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { isApiError } from '@/api/client/api-error';
import { useGetAuthorsId } from '@/api/generated/endpoints';
import { useAuthStore } from '@/domains/auth';
import { AuthorDeleteDialog, AuthorFormDrawer } from '@/domains/authors';
import { PageHeader, PageState } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const drawerOpen = ref(false);
const deleteDialogOpen = ref(false);

const authorId = computed(() => {
  const value = route.params.id;

  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    return undefined;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
});

const query = useGetAuthorsId(computed(() => authorId.value ?? 0), {
  query: {
    enabled: computed(() => authorId.value !== undefined),
  },
});

const author = computed(() => query.data.value?.data.data);
const authorName = computed(
  () => author.value?.full_name?.trim() || 'Имя автора не указано',
);
const books = computed(() => author.value?.books ?? []);
const isNotFound = computed(
  () =>
    authorId.value === undefined ||
    (query.isError.value && isApiError(query.error.value) && query.error.value.status === 404) ||
    (query.isSuccess.value && author.value === undefined)
);
const breadcrumbs = computed(() => [
  { label: 'Авторы', to: { name: 'authors' } },
  { label: author.value ? authorName.value : 'Автор' },
]);

watch(authorId, () => {
  drawerOpen.value = false;
  deleteDialogOpen.value = false;
});

function hasBookId(id: number | undefined): id is number {
  return id !== undefined && Number.isSafeInteger(id) && id > 0;
}

async function handleDeleted() {
  await router.push({ name: 'authors' });
}
</script>

<template>
  <div class="min-w-0 space-y-6">
    <PageHeader
      :title="author ? authorName : 'Автор'"
      :description="author ? 'Книги автора' : 'Информация об авторе'"
      :breadcrumbs="breadcrumbs"
    >
      <template v-if="authStore.isAuthenticated && author" #actions>
        <Button type="button" @click="drawerOpen = true">Редактировать</Button>
        <Button type="button" variant="destructive" @click="deleteDialogOpen = true">
          Удалить
        </Button>
      </template>
    </PageHeader>

    <PageState
      v-if="isNotFound"
      title="Автор не найден"
      description="Возможно, автор был удалён или указан неверный адрес."
    >
      <template #action>
        <Button as-child>
          <RouterLink :to="{ name: 'authors' }">Вернуться к авторам</RouterLink>
        </Button>
      </template>
    </PageState>

    <div v-else-if="query.isPending.value" class="space-y-3" aria-label="Загрузка автора">
      <Skeleton class="h-24 w-full rounded-xl" />
      <Skeleton class="h-24 w-full rounded-xl" />
      <Skeleton class="h-24 w-full rounded-xl" />
    </div>

    <PageState
      v-else-if="query.isError.value"
      title="Не удалось загрузить автора"
      description="Попробуйте повторить запрос позже."
    >
      <template #action>
        <Button :disabled="query.isFetching.value" @click="query.refetch()">
          {{ query.isFetching.value ? 'Загрузка…' : 'Повторить' }}
        </Button>
      </template>
    </PageState>

    <PageState
      v-else-if="books.length === 0"
      title="У автора пока нет книг"
      description="Связанные с этим автором книги ещё не добавлены в каталог."
    />

    <ul v-else class="min-w-0 space-y-3" aria-label="Книги автора">
      <li
        v-for="(book, index) in books"
        :key="book.id ?? `${book.title ?? 'book'}-${index}`"
        class="min-w-0 rounded-xl border bg-card p-4 text-card-foreground shadow-sm"
      >
        <RouterLink
          v-if="hasBookId(book.id)"
          :to="{ name: 'book-details', params: { id: book.id } }"
          class="block w-fit max-w-full break-words font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {{ book.title?.trim() || 'Название книги не указано' }}
        </RouterLink>
        <span v-else class="block break-words font-medium">
          {{ book.title?.trim() || 'Название книги не указано' }}
        </span>
        <p class="mt-1 break-words text-sm text-muted-foreground">
          {{ book.year !== undefined ? `Год: ${book.year}` : 'Год не указан' }}
        </p>
      </li>
    </ul>

    <AuthorFormDrawer
      v-if="authStore.isAuthenticated && author"
      v-model:open="drawerOpen"
      mode="edit"
      :author="author"
    />

    <AuthorDeleteDialog
      v-if="authStore.isAuthenticated && author"
      v-model:open="deleteDialogOpen"
      :author="author"
      @deleted="handleDeleted"
    />
  </div>
</template>
