import * as z from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.url().default('http://localhost:5173/api/v1'),
    BASE_URL: z
      .string()
      .regex(/^\/(?:[^?#]*\/)?$/, 'BASE_URL must be a path like / or /subcatalog/'),
    API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),
    MOCK_JWT_SECRET: z.string().min(1),
    DEV: z.boolean(),
  });

  const envVars = {
    ...Object.entries(import.meta.env).reduce<Record<string, string>>((acc, curr) => {
      const [key, value] = curr;
      if (key.startsWith('VITE_')) {
        acc[key.replace('VITE_', '')] = value;
      }
      return acc;
    }, {}),
    // vite.config.ts provides this variable
    BASE_URL: import.meta.env.BASE_URL,
    DEV: import.meta.env.DEV,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
      The following variables are missing or invalid:
      ${Object.entries(parsedEnv.error.flatten().fieldErrors)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')}
      `
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
