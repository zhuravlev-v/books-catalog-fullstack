export { useAuthorsList } from './composables/use-authors-list';
export { useAuthorQuerySync } from './composables/use-author-query-sync';
export { default as AuthorDeleteDialog } from './components/AuthorDeleteDialog.vue';
export { default as AuthorForm } from './components/AuthorForm.vue';
export { default as AuthorFormDrawer } from './components/AuthorFormDrawer.vue';
export { applyAuthorFormError } from './lib/author-form-error';
export {
  authorFormSchema,
  authorValidationSchema,
} from './model/author-form.schema';
export type { AuthorFormValues } from './model/author-form.schema';
