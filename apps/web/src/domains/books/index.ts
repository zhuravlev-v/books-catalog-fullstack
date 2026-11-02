export { useBooksList } from './composables/use-books-list';
export { useBookQuerySync } from './composables/use-book-query-sync';
export { default as BookForm } from './components/BookForm.vue';
export { default as BookFormDrawer } from './components/BookFormDrawer.vue';
export { default as BookDeleteDialog } from './components/BookDeleteDialog.vue';
export { applyBookFormError } from './lib/book-form-error';
export { bookFormSchema, createBookValidationSchema } from './model/book-form.schema';
export type { BookFormValues } from './model/book-form.schema';
