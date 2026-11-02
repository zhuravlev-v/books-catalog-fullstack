<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import defaultFallbackSrc from '@/assets/image-placeholder.svg';
import { cn } from '@/shared/lib/utils';

defineOptions({ inheritAttrs: false });

type ImageSize = 'sm' | 'md' | 'lg' | 'full';
type ImageFit = 'cover' | 'contain';

const props = withDefaults(
  defineProps<{
    src?: string | null;
    alt: string;
    fallbackSrc?: string;
    size?: ImageSize;
    fit?: ImageFit;
  }>(),
  {
    src: undefined,
    fallbackSrc: defaultFallbackSrc,
    size: 'full',
    fit: 'cover',
  },
);

const sizeClasses: Record<ImageSize, string> = {
  sm: 'w-16',
  md: 'w-32',
  lg: 'w-48',
  full: 'w-full',
};

const fitClasses: Record<ImageFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
};

const primaryFailed = ref(false);
const fallbackFailed = ref(false);

const normalizedSrc = computed(() => props.src?.trim() || undefined);
const normalizedFallbackSrc = computed(() => props.fallbackSrc.trim() || defaultFallbackSrc);
const usesPrimarySource = computed(() => Boolean(normalizedSrc.value) && !primaryFailed.value);
const currentSrc = computed(() => {
  if (usesPrimarySource.value) {
    return normalizedSrc.value;
  }

  return fallbackFailed.value ? undefined : normalizedFallbackSrc.value;
});

const imageClass = computed(() =>
  cn('block bg-muted', sizeClasses[props.size], fitClasses[props.fit]),
);

watch(
  () => props.src,
  () => {
    primaryFailed.value = false;
    fallbackFailed.value = false;
  },
);

watch(
  () => props.fallbackSrc,
  () => {
    fallbackFailed.value = false;
  },
);

function handleError(): void {
  if (usesPrimarySource.value) {
    primaryFailed.value = true;

    if (normalizedSrc.value === normalizedFallbackSrc.value) {
      fallbackFailed.value = true;
    }

    return;
  }

  fallbackFailed.value = true;
}
</script>

<template>
  <img
    v-if="currentSrc"
    v-bind="$attrs"
    :src="currentSrc"
    :alt="alt"
    :class="imageClass"
    @error="handleError"
  />
  <div
    v-else
    :class="imageClass"
    role="img"
    :aria-label="alt"
  />
</template>
