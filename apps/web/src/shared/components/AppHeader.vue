<script setup lang="ts">
import { ref, watch } from 'vue';
import { Menu } from '@lucide/vue';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/domains/auth';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { user, isAuthenticated, isSessionRestored } = storeToRefs(authStore);
const isMobileMenuOpen = ref(false);

const navigation = [
  { label: 'Главная', to: '/', section: 'home' },
  { label: 'Книги', to: '/books', section: 'books' },
  { label: 'Авторы', to: '/authors', section: 'authors' },
] as const;

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false;
  }
);

async function logout(): Promise<void> {
  authStore.logout();
  isMobileMenuOpen.value = false;
  await router.push({ name: 'home' });
}
</script>

<template>
  <header class="shrink-0 border-b bg-background">
    <div class="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
      <RouterLink
        to="/"
        class="shrink-0 rounded-sm text-lg font-semibold tracking-tight transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Каталог книг
      </RouterLink>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
        <RouterLink
          v-for="item in navigation"
          :key="item.section"
          :to="item.to"
          class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          exactActiveClass="bg-accent text-accent-foreground"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="ml-auto hidden min-w-0 items-center gap-2 md:flex">
        <Skeleton v-if="!isSessionRestored" class="h-9 w-40" aria-label="Восстановление сессии" />

        <template v-else-if="isAuthenticated">
          <span class="max-w-48 truncate text-sm font-medium" :title="user?.username">
            {{ user?.username }}
          </span>
          <Button type="button" variant="outline" @click="logout">Выйти</Button>
        </template>

        <template v-else>
          <Button as-child variant="ghost">
            <RouterLink to="/login">Войти</RouterLink>
          </Button>
          <Button as-child>
            <RouterLink to="/register">Регистрация</RouterLink>
          </Button>
        </template>
      </div>

      <Sheet v-model:open="isMobileMenuOpen">
        <SheetTrigger as-child>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            class="ml-auto md:hidden"
            aria-label="Открыть меню навигации"
          >
            <Menu aria-hidden="true" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" class="w-full max-w-xs">
          <SheetHeader>
            <SheetTitle>Навигация</SheetTitle>
            <SheetDescription class="sr-only">Разделы каталога книг</SheetDescription>
          </SheetHeader>

          <nav class="flex flex-col gap-1 px-4" aria-label="Мобильная навигация">
            <RouterLink
              v-for="item in navigation"
              :key="item.section"
              :to="item.to"
              class="rounded-md px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              exactActiveClass="bg-accent text-accent-foreground"
              @click="isMobileMenuOpen = false"
            >
              {{ item.label }}
            </RouterLink>

            <div class="my-2 border-t" />

            <Skeleton
              v-if="!isSessionRestored"
              class="h-11 w-full"
              aria-label="Восстановление сессии"
            />

            <template v-else-if="isAuthenticated">
              <p class="truncate px-3 py-2 text-sm font-medium" :title="user?.username">
                {{ user?.username }}
              </p>
              <Button type="button" variant="outline" class="w-full" @click="logout">
                Выйти
              </Button>
            </template>

            <template v-else>
              <Button as-child variant="ghost" class="w-full justify-start">
                <RouterLink to="/login" @click="isMobileMenuOpen = false">Войти</RouterLink>
              </Button>
              <Button as-child class="w-full justify-start">
                <RouterLink to="/register" @click="isMobileMenuOpen = false">
                  Регистрация
                </RouterLink>
              </Button>
            </template>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  </header>
</template>
