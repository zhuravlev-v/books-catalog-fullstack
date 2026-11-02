import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { env } from '@/shared/config/env';

declare module 'vue-router' {
  interface RouteMeta {
    layout: 'app' | 'auth';
    access: 'public' | 'guest' | 'protected';
  }
}

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/HomePage.vue'),
        meta: { layout: 'app', access: 'public' },
      },
      {
        path: 'books',
        name: 'books',
        component: () => import('@/pages/books/BooksPage.vue'),
        meta: { layout: 'app', access: 'public' },
      },
      {
        path: 'books/:id',
        name: 'book-details',
        component: () => import('@/pages/books/BookDetailsPage.vue'),
        meta: { layout: 'app', access: 'public' },
      },
      {
        path: 'authors',
        name: 'authors',
        component: () => import('@/pages/authors/AuthorsPage.vue'),
        meta: { layout: 'app', access: 'public' },
      },
      {
        path: 'authors/:id',
        name: 'author-details',
        component: () => import('@/pages/authors/AuthorDetailsPage.vue'),
        meta: { layout: 'app', access: 'public' },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/pages/NotFoundPage.vue'),
        meta: { layout: 'app', access: 'public' },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: { layout: 'auth', access: 'guest' },
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/auth/RegisterPage.vue'),
        meta: { layout: 'auth', access: 'guest' },
      },
    ],
  },
] satisfies RouteRecordRaw[];

const router = createRouter({
  history: createWebHistory(env.BASE_URL),
  routes,
});

export { installRouterGuards } from './guards';
export { getSafeRedirect } from './redirect';

export default router;
