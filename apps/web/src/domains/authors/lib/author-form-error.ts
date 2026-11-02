import { isApiError } from '@/api/client/api-error';

const FIELD_ERROR_FALLBACK = 'Некорректное имя автора';
const VALIDATION_ERROR_MESSAGE = 'Проверьте введённые данные и попробуйте ещё раз.';
const SUBMISSION_ERROR_MESSAGE = 'Не удалось сохранить автора. Попробуйте ещё раз.';

interface AuthorFormErrorHandlers {
  setFieldError: (field: 'full_name', message: string) => void;
  setFormError: (message: string) => void;
}

export function applyAuthorFormError(
  error: unknown,
  { setFieldError, setFormError }: AuthorFormErrorHandlers,
) {
  if (!isApiError(error) || error.status !== 422) {
    setFormError(SUBMISSION_ERROR_MESSAGE);
    return;
  }

  let hasFullNameError = false;
  let hasUnknownError = error.errors.length === 0;

  for (const fieldError of error.errors) {
    if (fieldError.field !== 'full_name') {
      hasUnknownError = true;
      continue;
    }

    if (!hasFullNameError) {
      setFieldError('full_name', fieldError.message?.trim() || FIELD_ERROR_FALLBACK);
      hasFullNameError = true;
    }
  }

  if (hasUnknownError) {
    setFormError(VALIDATION_ERROR_MESSAGE);
  }
}
