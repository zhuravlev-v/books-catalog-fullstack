import type { ErrorItem } from '@/api/generated/models';

export interface BookFormInput {
  title: string;
  year: number;
  description?: string;
  isbn?: string;
  authorIds: number[];
  cover: Blob;
}

export type ParseBookFormResult =
  { data: BookFormInput; errors?: never } | { data?: never; errors: ErrorItem[] };

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

export async function parseBookFormRequest(request: Request): Promise<ParseBookFormResult> {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return { errors: [{ message: 'Тело запроса должно быть в формате multipart/form-data' }] };
  }

  const titleEntry = formData.get('title');
  const title = typeof titleEntry === 'string' ? titleEntry.trim() : '';
  const year = parseInteger(formData.get('year'));
  const authorIds = parseAuthorIds(formData.getAll('author_ids'));
  const coverEntry = formData.get('cover');
  const cover = coverEntry instanceof Blob && coverEntry.size > 0 ? coverEntry : undefined;
  const descriptionEntry = formData.get('description');
  const isbnEntry = formData.get('isbn');
  const errors: ErrorItem[] = [];

  if (!title) {
    errors.push({ field: 'title', message: 'Название обязательно' });
  }

  if (year === undefined) {
    errors.push({ field: 'year', message: 'Год должен быть целым числом' });
  }

  if (authorIds === undefined) {
    errors.push({ field: 'author_ids', message: 'Укажите хотя бы одного автора' });
  }

  if (cover === undefined) {
    errors.push({ field: 'cover', message: 'Файл обложки обязателен' });
  }

  if (descriptionEntry !== null && typeof descriptionEntry !== 'string') {
    errors.push({ field: 'description', message: 'Описание должно быть строкой' });
  }

  if (isbnEntry !== null && typeof isbnEntry !== 'string') {
    errors.push({ field: 'isbn', message: 'ISBN должен быть строкой' });
  }

  if (errors.length > 0 || year === undefined || authorIds === undefined || cover === undefined) {
    return { errors };
  }

  return {
    data: {
      title,
      year,
      authorIds,
      cover,
      ...(typeof descriptionEntry === 'string' ? { description: descriptionEntry } : {}),
      ...(typeof isbnEntry === 'string' ? { isbn: isbnEntry } : {}),
    },
  };
}
