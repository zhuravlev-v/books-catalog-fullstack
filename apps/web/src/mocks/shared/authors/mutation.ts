import { HttpResponse } from 'msw';

import type {
  ApiErrorResponse as ApiError,
  ErrorItem,
} from '@books/api-contract/models';

export function unprocessableAuthorMutation(errors: ErrorItem[]): never {
  throw HttpResponse.json<ApiError>(
    { success: false, errors },
    { status: 422 }
  );
}
