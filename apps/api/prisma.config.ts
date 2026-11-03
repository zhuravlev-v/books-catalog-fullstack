import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config({ path: '../../.env' });

const user = encodeURIComponent(process.env.DB_USER ?? '');
const password = encodeURIComponent(process.env.DB_PASSWORD ?? '');
const host = process.env.DB_HOST ?? 'localhost';
const port = process.env.DB_PORT ?? '5432';
const database = encodeURIComponent(process.env.DB_NAME ?? '');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node --env-file=../../.env prisma/seed.ts',
  },
  datasource: {
    url: `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`,
  },
});
