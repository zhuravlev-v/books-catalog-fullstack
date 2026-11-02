<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { Book } from '@/api/generated/models';
import { useAuthStore } from '@/domains/auth';
import { BookDeleteDialog, BookFormDrawer, useBooksList } from '@/domains/books';
import { AppImage, AppPagination, PageHeader, PageState } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Skeleton } from '@/shared/ui/skeleton';

const {
  page,
  perPage,
  search,
  year,
  authorId,
  setPage,
  setYear,
  setAuthorId,
  query,
  authorsQuery,
} = useBooksList();
const authStore = useAuthStore();
const drawerOpen = ref(false);
const selectedBook = ref<Book | null>(null);
const deleteDialogOpen = ref(false);
const bookToDelete = ref<Book | null>(null);

const response = computed(() => query.data.value?.data.data);
const books = computed(() => response.value?.items ?? []);
const pagination = computed(() => response.value?.pagination);
const total = computed(() => pagination.value?.total ?? books.value.length);
const totalPages = computed(() => pagination.value?.total_pages ?? 1);
const authors = computed(() => authorsQuery.data.value?.data.data?.items ?? []);
const hasActiveFilters = computed(
  () => Boolean(search.value.trim()) || year.value !== undefined || authorId.value !== undefined
);

function hasValidId(id: number | undefined): id is number {
  return id !== undefined && Number.isSafeInteger(id) && id > 0;
}

function updateYear(value: string | number) {
  const parsed = Number(value);
  setYear(Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined);
}

function updateAuthor(value: unknown) {
  const parsed = Number(value);
  setAuthorId(Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined);
}

function openDrawer(book: Book | undefined | null = null) {
  selectedBook.value = book;
  drawerOpen.value = true;
}

function openDeleteDialog(book: Book) {
  bookToDelete.value = book;
  deleteDialogOpen.value = true;
}

function handleDeleted() {
  bookToDelete.value = null;
}
</script>

<template>
  <div class="min-w-0 space-y-6">
    <PageHeader title="Книги" description="Каталог книг">
      <template v-if="authStore.isAuthenticated" #actions>
        <Button type="button" @click="openDrawer()">Добавить книгу</Button>
      </template>
    </PageHeader>

    <div class="grid min-w-0 gap-4 md:grid-cols-3">
      <div class="min-w-0 space-y-2">
        <label for="books-search" class="text-sm font-medium">Поиск книг</label>
        <Input
          id="books-search"
          v-model="search"
          type="search"
          placeholder="Название книги"
          autocomplete="off"
        />
      </div>
      <div class="min-w-0 space-y-2">
        <label for="books-year" class="text-sm font-medium">Год издания</label>
        <Input
          id="books-year"
          :model-value="year ?? ''"
          type="number"
          min="1100"
          :max="new Date().getFullYear()"
          step="1"
          placeholder="Любой год"
          @update:model-value="updateYear"
        />
      </div>
      <div class="min-w-0 space-y-2">
        <label class="text-sm font-medium">Автор</label>
        <Select
          :model-value="authorId ? String(authorId) : 'all'"
          :disabled="authorsQuery.isPending.value || authorsQuery.isError.value"
          @update:model-value="updateAuthor"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Все авторы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все авторы</SelectItem>
            <SelectItem
              v-for="(author, index) in authors"
              :key="author.id ?? `${author.full_name ?? 'author'}-${index}`"
              :value="String(author.id)"
              :disabled="!hasValidId(author.id)"
            >
              {{ author.full_name?.trim() || 'Имя автора не указано' }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div
      v-if="query.isPending.value"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Загрузка книг"
    >
      <Skeleton v-for="item in 6" :key="item" class="aspect-[3/2] w-full rounded-xl" />
    </div>

    <PageState
      v-else-if="query.isError.value"
      title="Не удалось загрузить книги"
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
      :title="hasActiveFilters ? 'Книги не найдены' : 'Каталог книг пуст'"
      :description="
        hasActiveFilters
          ? 'Попробуйте изменить параметры поиска.'
          : 'В каталоге пока нет ни одной книги.'
      "
    />

    <template v-else>
      <ul class="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Список книг">
        <li
          v-for="(book, index) in books"
          :key="book.id ?? `${book.title ?? 'book'}-${index}`"
          class="min-w-0 overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
        >
          <AppImage
            :src="book.cover_url"
            :alt="`Обложка книги «${book.title?.trim() || 'Без названия'}»`"
            class="aspect-[3/2] w-full"
          />
          <div class="min-w-0 space-y-2 p-4">
            <RouterLink
              v-if="hasValidId(book.id)"
              :to="{ name: 'book-details', params: { id: book.id } }"
              class="block w-fit max-w-full break-words font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {{ book.title?.trim() || 'Название книги не указано' }}
            </RouterLink>
            <span v-else class="block break-words font-semibold">
              {{ book.title?.trim() || 'Название книги не указано' }}
            </span>
            <p class="text-sm text-muted-foreground">
              {{ book.year !== undefined ? `Год: ${book.year}` : 'Год не указан' }}
            </p>
            <div class="flex min-w-0 flex-wrap gap-x-2 gap-y-1 text-sm">
              <template v-if="book.authors?.length">
                <template
                  v-for="(author, authorIndex) in book.authors"
                  :key="author.id ?? authorIndex"
                >
                  <RouterLink
                    v-if="hasValidId(author.id)"
                    :to="{ name: 'author-details', params: { id: author.id } }"
                    class="max-w-full break-words text-primary underline-offset-4 hover:underline"
                  >
                    {{ author.full_name?.trim() || 'Автор не указан' }}
                  </RouterLink>
                  <span v-else class="max-w-full break-words">
                    {{ author.full_name?.trim() || 'Автор не указан' }}
                  </span>
                </template>
              </template>
              <span v-else class="text-muted-foreground">Авторы не указаны</span>
            </div>
            <div
              v-if="authStore.isAuthenticated && hasValidId(book.id)"
              class="flex flex-wrap gap-2"
            >
              <Button type="button" variant="outline" size="sm" @click="openDrawer(book)">
                Редактировать
              </Button>
              <Button type="button" variant="destructive" size="sm" @click="openDeleteDialog(book)">
                Удалить
              </Button>
            </div>
          </div>
        </li>
      </ul>

      <AppPagination
        v-if="totalPages > 1"
        :page="page"
        :per-page="perPage"
        :total="total"
        @update:page="setPage"
      />
    </template>

    <BookFormDrawer
      v-if="authStore.isAuthenticated"
      v-model:open="drawerOpen"
      :mode="selectedBook ? 'edit' : 'create'"
      :book="selectedBook"
    />

    <BookDeleteDialog
      v-if="authStore.isAuthenticated"
      v-model:open="deleteDialogOpen"
      :book="bookToDelete"
      @deleted="handleDeleted"
    />
  </div>
</template>
