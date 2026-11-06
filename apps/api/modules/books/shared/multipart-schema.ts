import { fileTypeFromBuffer } from 'file-type';
import { z } from 'zod';

import { CreateBookBody, UpdateBookBody } from '@books/api-contract/schemas';

const ALLOWED_COVER_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const MultipartInteger = z
  .string()
  .trim()
  .regex(/^-?\d+$/)
  .transform(Number)
  .pipe(z.int());

const MultipartBoolean = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const MultipartAuthorIds = z
  .union([MultipartInteger, z.array(MultipartInteger)])
  .transform((value) => (Array.isArray(value) ? value : [value]));

const BookPatchBody = UpdateBookBody.refine(
  (body) => Object.keys(body).length > 0,
  { message: 'Укажите хотя бы одно поле для обновления' }
).refine((body) => !(body.cover !== undefined && body.remove_cover === true), {
  path: ['remove_cover'],
  message: 'Нельзя одновременно заменить и удалить обложку',
});

const UploadedCover = z
  .custom<Express.Multer.File>(
    (value) =>
      typeof value === 'object' &&
      value !== null &&
      Buffer.isBuffer((value as Express.Multer.File).buffer),
    { message: 'Некорректный файл обложки' }
  )
  .transform(async (file, context) => {
    const detectedType = await fileTypeFromBuffer(file.buffer);

    if (
      detectedType === undefined ||
      !ALLOWED_COVER_TYPES.has(detectedType.mime)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Поддерживаются только изображения JPEG, PNG, WebP и AVIF',
        params: { httpStatus: 415 },
      });

      return z.NEVER;
    }

    file.mimetype = detectedType.mime;

    return new Blob([new Uint8Array(file.buffer)], {
      type: detectedType.mime,
    });
  });

const SingleCover = z
  .array(UploadedCover)
  .length(1, 'Поле cover должно содержать один файл')
  .transform(([cover]) => cover);

export const BookCreateMultipartSchema = z
  .looseObject({
    title: z.string().trim(),
    year: MultipartInteger,
    description: z.string().optional(),
    isbn: z.string().optional(),
    author_ids: MultipartAuthorIds,
    cover: SingleCover.optional(),
  })
  .pipe(CreateBookBody);

export const BookPatchMultipartSchema = z
  .looseObject({
    title: z.string().trim().optional(),
    year: MultipartInteger.optional(),
    description: z.string().optional(),
    isbn: z.string().optional(),
    author_ids: MultipartAuthorIds.optional(),
    cover: SingleCover.optional(),
    remove_cover: MultipartBoolean.optional(),
  })
  .pipe(BookPatchBody);
