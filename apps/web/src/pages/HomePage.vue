<script setup lang="ts">
import { PageHeader } from '@/shared/components';
import { TopAuthorsRating } from '@/domains/reports';

const currentYear = new Date().getFullYear();
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Главная"
      :description="`Топ-10 авторов по количеству выпущенных книг за ${currentYear} год.`"
    />
    <TopAuthorsRating />
  </div>
</template>
