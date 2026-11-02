<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();

defineSlots<{
  action?: () => unknown;
}>();
</script>

<template>
  <section
    class="flex min-w-0 flex-col items-center rounded-xl border border-dashed bg-card px-4 py-10 text-center text-card-foreground sm:px-6 sm:py-14"
  >
    <div class="w-full max-w-lg min-w-0 space-y-2">
      <h2 class="break-words text-xl font-semibold tracking-tight">{{ title }}</h2>
      <p v-if="description" class="break-words text-sm text-muted-foreground sm:text-base">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.action" class="mt-6 flex max-w-full flex-wrap justify-center gap-2">
      <slot name="action" />
    </div>
  </section>
</template>
