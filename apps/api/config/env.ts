import dotenv from 'dotenv';
import * as z from 'zod';

dotenv.config({ path: '../../.env', quiet: true });

const createEnv = () => {
  const EnvSchema = z.object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    API_PORT: z.coerce.number().int().positive().default(3001),
    API_BASE_PATH: z.string().startsWith('/').default('/api/v1'),
    JWT_SECRET: z.string().min(32),
    JWT_ISSUER: z.string().min(1).default('books-api'),
    JWT_AUDIENCE: z.string().min(1).default('books-web'),
    JWT_ACCESS_TOKEN_TTL_SECONDS: z.coerce
      .number()
      .int()
      .positive()
      .default(900),
    AUTH_REFRESH_TOKEN_TTL_SECONDS: z.coerce
      .number()
      .int()
      .positive()
      .default(2_592_000),
    DB_NAME: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_HOST: z.string().min(1).default('localhost'),
    DB_PORT: z.coerce.number().int().positive().default(5432),
    S3_ENDPOINT: z.url(),
    S3_REGION: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_PUBLIC_BASE_URL: z.url().transform((value) => value.replace(/\/+$/, '')),
    S3_FORCE_PATH_STYLE: z
      .string()
      .refine((value) => value === 'true' || value === 'false')
      .transform((value) => value === 'true'),
    S3_MAX_FILE_SIZE: z.coerce.number().int().positive(),
  });

  const parsedEnv = EnvSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
      The following variables are missing or invalid:
      ${Object.entries(parsedEnv.error.flatten().fieldErrors)
        .map(([key, errors]) => `- ${key}: ${errors}`)
        .join('\n')}
      `
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
