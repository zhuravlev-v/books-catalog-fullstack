<script setup lang="ts">
import { RouterLink } from 'vue-router';
import PageState from '@/shared/components/PageState.vue';
import { Button } from '@/shared/ui/button';
</script>

<template>
  <PageState title="Страница не найдена" description="Запрошенная страница не существует.">
    <template #action>
      <Button as-child>
        <RouterLink :to="{ name: 'home' }">Вернуться на главную</RouterLink>
      </Button>
    </template>
  </PageState>
</template>
