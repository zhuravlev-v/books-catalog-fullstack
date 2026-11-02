<script setup lang="ts">
import { RouterView } from 'vue-router';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { env } from '@/shared/config/env';
import { queryClient } from '@/app/providers';
import { Toaster } from '@/shared/ui/sonner';
</script>

<template>
  <RouterView />
  <Toaster
    position="top-right"
    :duration="5000"
    close-button
    container-aria-label="Уведомления"
    :toast-options="{ closeButtonAriaLabel: 'Закрыть уведомление' }"
  />
  <VueQueryDevtools v-if="env.DEV" :client="queryClient" />
</template>
