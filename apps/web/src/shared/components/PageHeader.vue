<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import { RouterLink } from 'vue-router';

export interface PageHeaderBreadcrumb {
  label: string;
  to?: RouteLocationRaw;
}

defineProps<{
  title: string;
  description?: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
}>();

defineSlots<{
  actions?: () => unknown;
}>();
</script>

<template>
  <header class="min-w-0 space-y-3">
    <nav
      v-if="breadcrumbs?.length"
      class="min-w-0 text-sm text-muted-foreground"
      aria-label="Хлебные крошки"
    >
      <ol class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <li
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="`${breadcrumb.label}-${index}`"
          class="flex min-w-0 items-center gap-2"
        >
          <span v-if="index > 0" aria-hidden="true">/</span>
          <RouterLink
            v-if="breadcrumb.to && index < breadcrumbs.length - 1"
            :to="breadcrumb.to"
            class="break-words rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {{ breadcrumb.label }}
          </RouterLink>
          <span v-else class="break-words text-foreground" aria-current="page">
            {{ breadcrumb.label }}
          </span>
        </li>
      </ol>
    </nav>

    <div class="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0 space-y-2">
        <h1 class="break-words text-3xl font-semibold tracking-tight">{{ title }}</h1>
        <p v-if="description" class="break-words text-muted-foreground">{{ description }}</p>
      </div>

      <div v-if="$slots.actions" class="flex min-w-0 shrink-0 flex-wrap items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
