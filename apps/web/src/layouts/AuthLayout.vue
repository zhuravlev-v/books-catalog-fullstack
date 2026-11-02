<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <main class="grid min-h-screen min-w-0 place-items-center bg-background px-4 py-8 sm:px-6">
    <div class="w-full max-w-md">
      <RouterView />
    </div>
  </main>
</template>
