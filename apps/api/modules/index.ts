import express from 'express';
import { prisma } from '../prisma/prisma-client.ts';

const router = express.Router();

router.get('/health', async function (_, res, next) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

export default router;
