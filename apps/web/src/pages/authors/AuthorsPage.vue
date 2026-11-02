<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { AuthorShort } from '@/api/generated/models';
import { useAuthStore } from '@/domains/auth';
import { AuthorDeleteDialog, AuthorFormDrawer, useAuthorsList } from '@/domains/authors';
import { AppPagination, PageHeader, PageState } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Skeleton } from '@/shared/ui/skeleton';

const { page, perPage, search, setPage, query } = useAuthorsList();
const authStore = useAuthStore();
const drawerOpen = ref(false);
const selectedAuthor = ref<AuthorShort | null>(null);
const deleteDialogOpen = ref(false);
const authorToDelete = ref<AuthorShort | null>(null);

const response = computed(() => query.data.value?.data.data);
const authors = computed(() => response.value?.items ?? []);
const pagination = computed(() => response.value?.pagination);
const total = computed(() => pagination.value?.total ?? authors.value.length);
const totalPages = computed(() => pagination.value?.total_pages ?? 1);

function openCreateDrawer() {
  selectedAuthor.value = null;
  drawerOpen.value = true;
}

function openEditDrawer(author: AuthorShort) {
  selectedAuthor.value = author;
  drawerOpen.value = true;
}

function openDeleteDialog(author: AuthorShort) {
  authorToDelete.value = author;
  deleteDialogOpen.value = true;
}

function handleDeleted() {
  authorToDelete.value = null;
}
</script>

<template>
  <div class="min-w-0 space-y-6">
    <PageHeader title="Авторы" description="Каталог авторов">
      <template v-if="authStore.isAuthenticated" #actions>
        <Button type="button" @click="openCreateDrawer">Добавить автора</Button>
      </template>
    </PageHeader>

    <div class="max-w-xl space-y-2">
      <label for="authors-search" class="text-sm font-medium">Поиск авторов</label>
      <Input
        id="authors-search"
        v-model="search"
        type="search"
        placeholder="Введите имя автора"
        autocomplete="off"
      />
    </div>

    <div v-if="query.isPending.value" class="space-y-3" aria-label="Загрузка авторов">
      <Skeleton v-for="item in 6" :key="item" class="h-16 w-full rounded-xl" />
    </div>

    <PageState
      v-else-if="query.isError.value"
      title="Не удалось загрузить авторов"
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
      :title="search.trim() ? 'Авторы не найдены' : 'Список авторов пуст'"
      :description="
        search.trim()
          ? 'Попробуйте изменить поисковый запрос.'
          : 'В каталоге пока нет ни одного автора.'
      "
    />

    <template v-else>
      <ul class="min-w-0 space-y-3" aria-label="Список авторов">
        <li
          v-for="(author, index) in authors"
          :key="author.id ?? `${author.full_name ?? 'author'}-${index}`"
          class="min-w-0 rounded-xl border bg-card p-4 text-card-foreground shadow-sm"
        >
          <div class="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <RouterLink
              v-if="author.id !== undefined"
              :to="{ name: 'author-details', params: { id: author.id } }"
              class="block w-fit max-w-full break-words font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {{ author.full_name?.trim() || 'Имя автора не указано' }}
            </RouterLink>
            <span v-else class="block break-words font-medium">
              {{ author.full_name?.trim() || 'Имя автора не указано' }}
            </span>
            <div v-if="authStore.isAuthenticated && author.id !== undefined" class="flex gap-2">
              <Button type="button" variant="outline" size="sm" @click="openEditDrawer(author)">
                Редактировать
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                @click="openDeleteDialog(author)"
              >
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

    <AuthorFormDrawer
      v-if="authStore.isAuthenticated"
      v-model:open="drawerOpen"
      :mode="selectedAuthor ? 'edit' : 'create'"
      :author="selectedAuthor"
    />

    <AuthorDeleteDialog
      v-if="authStore.isAuthenticated"
      v-model:open="deleteDialogOpen"
      :author="authorToDelete"
      @deleted="handleDeleted"
    />
  </div>
</template>
