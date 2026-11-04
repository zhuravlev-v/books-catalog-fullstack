import type { Request } from 'express';
import { ZodError, type ZodType, type output } from 'zod';

import { HttpError } from './errors.ts';

interface RequestSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

type ParsedRequest<Schemas extends RequestSchemas> = {
  [Location in keyof Schemas]: Schemas[Location] extends ZodType
    ? output<Schemas[Location]>
    : never;
};

const validationStatus = {
  body: 422,
  params: 400,
  query: 400,
} as const;

export function parseRequest<const Schemas extends RequestSchemas>(
  request: Request,
  schemas: Schemas
): ParsedRequest<Schemas> {
  const sources = {
    body: request.body,
    params: request.params,
    query: request.query,
  };
  const parsed: Partial<Record<keyof RequestSchemas, unknown>> = {};

  for (const location of ['body', 'params', 'query'] as const) {
    const schema = schemas[location];

    if (schema === undefined) {
      continue;
    }

    try {
      parsed[location] = schema.parse(sources[location]);
    } catch (error) {
      if (!(error instanceof ZodError)) {
        throw error;
      }

      throw new HttpError(
        validationStatus[location],
        error.issues.map((issue) => ({
          field:
            issue.path.length > 0 ? issue.path.map(String).join('.') : location,
          message: issue.message,
        })),
        { cause: error }
      );
    }
  }

  return parsed as ParsedRequest<Schemas>;
}
