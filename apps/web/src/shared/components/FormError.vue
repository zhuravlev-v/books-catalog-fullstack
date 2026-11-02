<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <p
    role="alert"
    aria-live="polite"
    class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
  >
    {{ message }}
  </p>
</template>
