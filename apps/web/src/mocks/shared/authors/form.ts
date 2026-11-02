import type { ErrorItem } from '@/api/generated/models';

export interface AuthorFormInput {
  fullName: string;
}

export type ParseAuthorFormResult =
  { data: AuthorFormInput; errors?: never } | { data?: never; errors: ErrorItem[] };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function parseAuthorFormRequest(request: Request): Promise<ParseAuthorFormResult> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { errors: [{ message: 'Тело запроса должно быть в формате JSON' }] };
  }

  if (!isObject(body)) {
    return { errors: [{ message: 'Тело запроса должно быть JSON-объектом' }] };
  }

  if (typeof body.full_name !== 'string' || body.full_name.trim().length === 0) {
    return {
      errors: [{ field: 'full_name', message: 'ФИО должно быть непустой строкой' }],
    };
  }

  return { data: { fullName: body.full_name.trim() } };
}
