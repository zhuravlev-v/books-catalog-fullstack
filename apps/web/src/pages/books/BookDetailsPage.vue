<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { isApiError } from '@/api/client/api-error';
import { useGetBooksId } from '@/api/generated/endpoints';
import { useAuthStore } from '@/domains/auth';
import { BookDeleteDialog, BookFormDrawer } from '@/domains/books';
import { AppImage, PageHeader, PageState } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const drawerOpen = ref(false);
const deleteDialogOpen = ref(false);

const bookId = computed(() => {
  const value = route.params.id;

  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    return undefined;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
});

const query = useGetBooksId(computed(() => bookId.value ?? 0), {
  query: {
    enabled: computed(() => bookId.value !== undefined),
  },
});

const book = computed(() => query.data.value?.data.data);
const bookTitle = computed(() => book.value?.title?.trim() || 'Название книги не указано');
const isNotFound = computed(
  () =>
    bookId.value === undefined ||
    (query.isError.value && isApiError(query.error.value) && query.error.value.status === 404) ||
    (query.isSuccess.value && book.value === undefined),
);
const breadcrumbs = computed(() => [
  { label: 'Книги', to: { name: 'books' } },
  { label: book.value ? bookTitle.value : 'Книга' },
]);

function hasValidId(id: number | undefined): id is number {
  return id !== undefined && Number.isSafeInteger(id) && id > 0;
}

watch(bookId, () => {
  drawerOpen.value = false;
  deleteDialogOpen.value = false;
});

async function handleDeleted() {
  await router.push({ name: 'books' });
}
</script>

<template>
  <div class="min-w-0 space-y-6">
    <PageHeader
      :title="book ? bookTitle : 'Книга'"
      description="Информация о книге"
      :breadcrumbs="breadcrumbs"
    >
      <template v-if="authStore.isAuthenticated && book" #actions>
        <Button type="button" @click="drawerOpen = true">Редактировать</Button>
        <Button type="button" variant="destructive" @click="deleteDialogOpen = true">
          Удалить
        </Button>
      </template>
    </PageHeader>

    <PageState
      v-if="isNotFound"
      title="Книга не найдена"
      description="Возможно, книга была удалена или указан неверный адрес."
    >
      <template #action>
        <Button as-child>
          <RouterLink :to="{ name: 'books' }">Вернуться к книгам</RouterLink>
        </Button>
      </template>
    </PageState>

    <div v-else-if="query.isPending.value" class="grid gap-6 md:grid-cols-[12rem_minmax(0,1fr)]" aria-label="Загрузка книги">
      <Skeleton class="aspect-[2/3] w-full rounded-xl" />
      <div class="space-y-3">
        <Skeleton class="h-8 w-2/3" />
        <Skeleton class="h-5 w-1/3" />
        <Skeleton class="h-24 w-full" />
      </div>
    </div>

    <PageState
      v-else-if="query.isError.value"
      title="Не удалось загрузить книгу"
      description="Попробуйте повторить запрос позже."
    >
      <template #action>
        <Button :disabled="query.isFetching.value" @click="query.refetch()">
          {{ query.isFetching.value ? 'Загрузка…' : 'Повторить' }}
        </Button>
      </template>
    </PageState>

    <article v-else-if="book" class="grid min-w-0 gap-6 md:grid-cols-[12rem_minmax(0,1fr)]">
      <AppImage
        :src="book.cover_url"
        :alt="`Обложка книги «${bookTitle}»`"
        size="lg"
        class="aspect-[2/3] max-w-full rounded-xl border shadow-sm"
      />
      <div class="min-w-0 space-y-5">
        <dl class="grid gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-muted-foreground">Год издания</dt>
            <dd class="mt-1 break-words">{{ book.year ?? 'Не указан' }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-muted-foreground">ISBN</dt>
            <dd class="mt-1 break-words">{{ book.isbn?.trim() || 'Не указан' }}</dd>
          </div>
        </dl>

        <section>
          <h2 class="text-sm font-medium text-muted-foreground">Авторы</h2>
          <div v-if="book.authors?.length" class="mt-1 flex min-w-0 flex-wrap gap-x-3 gap-y-1">
            <template v-for="(author, index) in book.authors" :key="author.id ?? index">
              <RouterLink
                v-if="hasValidId(author.id)"
                :to="{ name: 'author-details', params: { id: author.id } }"
                class="max-w-full break-words text-primary underline-offset-4 hover:underline"
              >
                {{ author.full_name?.trim() || 'Имя автора не указано' }}
              </RouterLink>
              <span v-else class="max-w-full break-words">
                {{ author.full_name?.trim() || 'Имя автора не указано' }}
              </span>
            </template>
          </div>
          <p v-else class="mt-1 text-muted-foreground">Авторы не указаны</p>
        </section>

        <section>
          <h2 class="text-sm font-medium text-muted-foreground">Описание</h2>
          <p class="mt-1 whitespace-pre-wrap break-words">
            {{ book.description?.trim() || 'Описание отсутствует' }}
          </p>
        </section>
      </div>
    </article>

    <BookFormDrawer
      v-if="authStore.isAuthenticated && book"
      v-model:open="drawerOpen"
      mode="edit"
      :book="book"
    />

    <BookDeleteDialog
      v-if="authStore.isAuthenticated && book"
      v-model:open="deleteDialogOpen"
      :book="book"
      @deleted="handleDeleted"
    />
  </div>
</template>
