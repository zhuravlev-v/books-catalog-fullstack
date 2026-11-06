import type { BookPatchForm, ErrorItem } from '@books/api-contract/models';
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
  cover?: Blob;
  removeCover?: boolean;
}

export type ParsePatchBookResult =
  | { data: PatchBookInput; errors?: never }
  | { data?: never; errors: ErrorItem[] };

function parseInteger(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== 'string' || !/^-?\d+$/.test(value.trim())) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isSafeInteger(parsedValue) ? parsedValue : undefined;
}

function parseAuthorIds(values: FormDataEntryValue[]): number[] | undefined {
  if (values.length === 0) {
    return undefined;
  }

  const authorIds = values.map(parseInteger);

  if (authorIds.some((authorId) => authorId === undefined || authorId <= 0)) {
    return undefined;
  }

  return [...new Set(authorIds as number[])];
}

export function parsePatchBooksIdParams(
  params: PatchBooksIdPathParams
): PatchBooksIdParams | undefined {
  const id = parsePositiveIntegerPathParam(params.id);

  return id === undefined ? undefined : { id };
}

export async function parsePatchBooksIdRequest(
  request: Request
): Promise<ParsePatchBookResult> {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return {
      errors: [
        { message: 'Тело запроса должно быть в формате multipart/form-data' },
      ],
    };
  }

  const data: PatchBookInput = {};
  const errors: ErrorItem[] = [];
  const hasField = (key: keyof BookPatchForm) => formData.has(key);

  if ([...formData.keys()].length === 0) {
    errors.push({ message: 'Укажите хотя бы одно поле для обновления' });
  }

  if (hasField('title')) {
    const title = formData.get('title');

    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push({
        field: 'title',
        message: 'Название должно быть непустой строкой',
      });
    } else {
      data.title = title.trim();
    }
  }

  if (hasField('year')) {
    const year = parseInteger(formData.get('year'));

    if (year === undefined || year <= 0) {
      errors.push({ field: 'year', message: 'Год должен быть целым числом' });
    } else {
      data.year = year;
    }
  }

  if (hasField('description')) {
    const description = formData.get('description');

    if (typeof description !== 'string') {
      errors.push({
        field: 'description',
        message: 'Описание должно быть строкой',
      });
    } else {
      data.description = description;
    }
  }

  if (hasField('isbn')) {
    const isbn = formData.get('isbn');

    if (typeof isbn !== 'string') {
      errors.push({ field: 'isbn', message: 'ISBN должен быть строкой' });
    } else {
      data.isbn = isbn;
    }
  }

  if (hasField('author_ids')) {
    const authorIds = parseAuthorIds(formData.getAll('author_ids'));

    if (authorIds === undefined) {
      errors.push({
        field: 'author_ids',
        message:
          'Укажите хотя бы одного автора с положительным целочисленным ID',
      });
    } else {
      data.authorIds = authorIds;
    }
  }

  if (hasField('cover')) {
    const cover = formData.get('cover');

    if (!(cover instanceof Blob) || cover.size === 0) {
      errors.push({ field: 'cover', message: 'Файл обложки обязателен' });
    } else {
      data.cover = cover;
    }
  }

  if (hasField('remove_cover')) {
    const removeCover = formData.get('remove_cover');

    if (removeCover !== 'true' && removeCover !== 'false') {
      errors.push({
        field: 'remove_cover',
        message: 'Значение remove_cover должно быть логическим',
      });
    } else {
      data.removeCover = removeCover === 'true';
    }
  }

  if (data.cover !== undefined && data.removeCover === true) {
    errors.push({
      field: 'remove_cover',
      message: 'Нельзя одновременно заменить и удалить обложку',
    });
  }

  return errors.length > 0 ? { errors } : { data };
}
