<script setup lang="ts">
import { RouterView } from 'vue-router';
import { AppHeader } from '@/shared/components';
</script>

<template>
  <div class="flex min-h-screen min-w-0 flex-col bg-background text-foreground">
    <AppHeader />

    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <RouterView />
    </main>

    <div id="global-ui" aria-live="polite" />
  </div>
</template>
