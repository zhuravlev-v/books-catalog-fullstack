import { env } from '../../../config/env.ts';
import { createMultipartMiddleware } from '../../../middleware/multipart.ts';
import {
  BookCreateMultipartSchema,
  BookPatchMultipartSchema,
} from '../shared/multipart-schema.ts';

const limits = {
  fileSize: env.S3_MAX_FILE_SIZE,
  files: 1,
};

export const validateBookCreateMultipart = createMultipartMiddleware({
  schema: BookCreateMultipartSchema,
  limits,
});

export const validateBookPatchMultipart = createMultipartMiddleware({
  schema: BookPatchMultipartSchema,
  limits,
});
