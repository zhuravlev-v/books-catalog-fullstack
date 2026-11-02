import { applyServerValidationErrors } from '@/domains/auth/lib/server-validation';
import type { BookFormValues } from '../model/book-form.schema';

const FORM_FIELDS = [
  'title',
  'year',
  'description',
  'isbn',
  'author_ids',
  'cover',
] as const satisfies readonly (keyof BookFormValues)[];

interface BookFormErrorHandlers {
  setFieldError: (field: keyof BookFormValues, message: string) => void;
  setFormError: (message: string) => void;
}

export function applyBookFormError(
  error: unknown,
  { setFieldError, setFormError }: BookFormErrorHandlers,
) {
  const result = applyServerValidationErrors(error, FORM_FIELDS, setFieldError);

  if (!result.handled) {
    setFormError('Не удалось сохранить книгу. Попробуйте ещё раз.');
  } else if (result.hasFormError) {
    setFormError('Проверьте введённые данные и попробуйте ещё раз.');
  }
}
