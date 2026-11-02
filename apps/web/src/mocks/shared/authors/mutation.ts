import { HttpResponse } from 'msw';

import type { Error as ApiError, ErrorItem } from '@/api/generated/models';

export function unprocessableAuthorMutation(errors: ErrorItem[]): never {
  throw HttpResponse.json<ApiError>({ success: false, errors }, { status: 422 });
}
