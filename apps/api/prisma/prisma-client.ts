import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import { env } from '../config/env.ts';

const user = encodeURIComponent(env.DB_USER);
const password = encodeURIComponent(env.DB_PASSWORD);
const host = env.DB_HOST;
const port = env.DB_PORT;
const database = encodeURIComponent(env.DB_NAME);

const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
