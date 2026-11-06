import type { RequestHandler } from 'express';
import multer from 'multer';
import type { ZodIssue, ZodType } from 'zod';

import { HttpError } from '../http/errors.ts';

interface MultipartMiddlewareOptions {
  schema: ZodType;
  limits: NonNullable<multer.Options['limits']>;
}

function getIssueStatus(issue: ZodIssue): number | undefined {
  if (issue.code !== 'custom') {
    return undefined;
  }

  const status = issue.params?.httpStatus;

  return typeof status === 'number' && status >= 400 && status <= 599
    ? status
    : undefined;
}

function requireMultipartContentType(): RequestHandler {
  return (request, _response, next) => {
    if (!request.is('multipart/form-data')) {
      next(
        new HttpError(422, [
          {
            message: 'Тело запроса должно быть в формате multipart/form-data',
          },
        ])
      );
      return;
    }

    next();
  };
}

function validateMultipartBody(schema: ZodType): RequestHandler {
  return async (request, _response, next) => {
    try {
      const body: Record<string, unknown> =
        typeof request.body === 'object' && request.body !== null
          ? { ...request.body }
          : {};
      const files = Array.isArray(request.files) ? request.files : [];
      const filesByField = new Map<string, Express.Multer.File[]>();

      for (const file of files) {
        const fieldFiles = filesByField.get(file.fieldname) ?? [];

        fieldFiles.push(file);
        filesByField.set(file.fieldname, fieldFiles);
      }

      for (const [field, fieldFiles] of filesByField) {
        if (Object.hasOwn(body, field)) {
          throw new HttpError(422, [
            {
              field,
              message: 'Поле не может одновременно содержать текст и файлы',
            },
          ]);
        }

        body[field] = fieldFiles;
      }

      const result = await schema.safeParseAsync(body);

      if (!result.success) {
        const status =
          result.error.issues.map(getIssueStatus).find(Boolean) ?? 422;

        throw new HttpError(
          status,
          result.error.issues.map((issue) => ({
            field: issue.path.length > 0 ? String(issue.path[0]) : undefined,
            message: issue.message,
          })),
          { cause: result.error }
        );
      }

      request.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function createMultipartMiddleware({
  schema,
  limits,
}: MultipartMiddlewareOptions): RequestHandler[] {
  const parseMultipart = multer({
    storage: multer.memoryStorage(),
    limits,
  }).any();

  return [
    requireMultipartContentType(),
    parseMultipart,
    validateMultipartBody(schema),
  ];
}
