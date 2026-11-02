import { isApiError } from '@/api/client/api-error';

const DEFAULT_FIELD_ERROR = 'Некорректное значение поля';

export interface ServerValidationResult {
  handled: boolean;
  hasFormError: boolean;
}

export function applyServerValidationErrors<Field extends string>(
  error: unknown,
  fields: readonly Field[],
  setFieldError: (field: Field, message: string) => void
): ServerValidationResult {
  if (!isApiError(error) || error.status !== 422) {
    return { handled: false, hasFormError: false };
  }

  const knownFields = new Set<string>(fields);
  const handledFields = new Set<Field>();
  let hasFormError = error.errors.length === 0;

  for (const fieldError of error.errors) {
    if (!fieldError.field || !knownFields.has(fieldError.field)) {
      hasFormError = true;
      continue;
    }

    const field = fieldError.field as Field;

    if (handledFields.has(field)) {
      continue;
    }

    setFieldError(field, fieldError.message?.trim() || DEFAULT_FIELD_ERROR);
    handledFields.add(field);
  }

  return { handled: true, hasFormError };
}
