import type { ApiErrorResponse, ErrorItem } from '@books/api-contract/models';

export class HttpError extends Error {
  readonly status: number;
  readonly errors: ErrorItem[];

  constructor(status: number, errors: ErrorItem[], options?: ErrorOptions) {
    super(errors[0]?.message ?? 'Request failed', options);
    this.name = 'HttpError';
    this.status = status;
    this.errors = errors;
  }

  toResponse(): ApiErrorResponse {
    return {
      success: false,
      errors: this.errors,
    };
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}
