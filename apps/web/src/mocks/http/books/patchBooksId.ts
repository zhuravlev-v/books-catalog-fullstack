import type { BookInput, ErrorItem } from '@/api/generated/models';
import { parsePositiveIntegerPathParam } from '@/mocks/shared/http/pathParams';

export interface PatchBooksIdPathParams {
  id?: string | readonly string[];
}

export interface PatchBooksIdParams {
  id: number;
}

export interface PatchBookInput {
  title?: string;
  year?: number;
  description?: string;
  isbn?: string;
  authorIds?: number[];
}

export type ParsePatchBookResult =
  { data: PatchBookInput; errors?: never } | { data?: never; errors: ErrorItem[] };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOwn(value: object, key: keyof BookInput): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

export function parsePatchBooksIdParams(
  params: PatchBooksIdPathParams
): PatchBooksIdParams | undefined {
  const id = parsePositiveIntegerPathParam(params.id);

  return id === undefined ? undefined : { id };
}

export async function parsePatchBooksIdRequest(request: Request): Promise<ParsePatchBookResult> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { errors: [{ message: 'Тело запроса должно быть в формате JSON' }] };
  }

  if (!isObject(body)) {
    return { errors: [{ message: 'Тело запроса должно быть JSON-объектом' }] };
  }

  const data: PatchBookInput = {};
  const errors: ErrorItem[] = [];

  if (hasOwn(body, 'title')) {
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Название должно быть непустой строкой' });
    } else {
      data.title = body.title.trim();
    }
  }

  if (hasOwn(body, 'year')) {
    if (typeof body.year !== 'number' || !Number.isSafeInteger(body.year)) {
      errors.push({ field: 'year', message: 'Год должен быть целым числом' });
    } else {
      data.year = body.year;
    }
  }

  if (hasOwn(body, 'description')) {
    if (typeof body.description !== 'string') {
      errors.push({ field: 'description', message: 'Описание должно быть строкой' });
    } else {
      data.description = body.description;
    }
  }

  if (hasOwn(body, 'isbn')) {
    if (typeof body.isbn !== 'string') {
      errors.push({ field: 'isbn', message: 'ISBN должен быть строкой' });
    } else {
      data.isbn = body.isbn;
    }
  }

  if (hasOwn(body, 'author_ids')) {
    if (
      !Array.isArray(body.author_ids) ||
      body.author_ids.length === 0 ||
      body.author_ids.some(
        (authorId) =>
          typeof authorId !== 'number' || !Number.isSafeInteger(authorId) || authorId <= 0
      )
    ) {
      errors.push({
        field: 'author_ids',
        message: 'Укажите хотя бы одного автора с положительным целочисленным ID',
      });
    } else {
      data.authorIds = [...new Set(body.author_ids as number[])];
    }
  }

  return errors.length > 0 ? { errors } : { data };
}
