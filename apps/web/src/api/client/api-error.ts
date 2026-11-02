export interface ApiFieldError {
  field?: string;
  message?: string;
}

export interface ApiErrorBody {
  success?: boolean;
  errors?: ApiFieldError[];
}

interface ApiErrorOptions<T> {
  status: number;
  data?: T;
  errors?: ApiFieldError[];
  cause?: unknown;
}

const DEFAULT_ERROR_MESSAGE = 'Не удалось выполнить запрос';

export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly data?: T;
  readonly errors: ApiFieldError[];

  constructor(message: string, options: ApiErrorOptions<T>) {
    super(message, { cause: options.cause });

    this.name = 'ApiError';
    this.status = options.status;
    this.data = options.data;
    this.errors = options.errors ?? [];
  }

  get isNetworkError() {
    return this.status === 0;
  }

  getFieldErrors(field: string) {
    return this.errors.filter((error) => error.field === field);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getApiErrorMessage(body: unknown, fallback = DEFAULT_ERROR_MESSAGE) {
  if (!isApiErrorBody(body)) {
    return fallback;
  }

  return body.errors?.find((error) => error.message)?.message ?? fallback;
}

export function getApiFieldErrors(body: unknown): ApiFieldError[] {
  if (!isApiErrorBody(body)) {
    return [];
  }

  return body.errors ?? [];
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const errors = (value as ApiErrorBody).errors;

  return (
    errors === undefined ||
    (Array.isArray(errors) &&
      errors.every(
        (error) =>
          !!error &&
          typeof error === 'object' &&
          (error.field === undefined || typeof error.field === 'string') &&
          (error.message === undefined || typeof error.message === 'string'),
      ))
  );
}
