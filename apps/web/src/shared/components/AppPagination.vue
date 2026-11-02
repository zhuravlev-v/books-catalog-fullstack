<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';

withDefaults(
  defineProps<{
    page: number;
    perPage: number;
    total: number;
    siblingCount?: number;
    showEdges?: boolean;
  }>(),
  {
    siblingCount: 0,
    showEdges: true,
  }
);

const emit = defineEmits<{
  'update:page': [page: number];
}>();
</script>

<template>
  <Pagination
    v-slot="{ page: currentPage }"
    :page="page"
    :items-per-page="perPage"
    :total="total"
    :sibling-count="siblingCount"
    :show-edges="showEdges"
    @update:page="emit('update:page', $event)"
  >
    <PaginationContent v-slot="{ items }" class="max-w-full">
      <PaginationPrevious aria-label="Предыдущая страница">
        <ChevronLeftIcon aria-hidden="true" />
        <span class="sr-only">Предыдущая страница</span>
      </PaginationPrevious>

      <template v-for="(item, index) in items" :key="`${item.type}-${index}`">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === currentPage"
          :aria-label="`Страница ${item.value}`"
        >
          {{ item.value }}
        </PaginationItem>
        <PaginationEllipsis v-else :index="index" />
      </template>

      <PaginationNext aria-label="Следующая страница">
        <ChevronRightIcon aria-hidden="true" />
        <span class="sr-only">Следующая страница</span>
      </PaginationNext>
    </PaginationContent>
  </Pagination>
</template>
