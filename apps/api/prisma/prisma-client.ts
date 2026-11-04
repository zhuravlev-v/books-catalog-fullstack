import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const user = encodeURIComponent(process.env.DB_USER ?? '');
const password = encodeURIComponent(process.env.DB_PASSWORD ?? '');
const host = process.env.DB_HOST ?? 'localhost';
const port = process.env.DB_PORT ?? '5432';
const database = encodeURIComponent(process.env.DB_NAME ?? '');

const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
