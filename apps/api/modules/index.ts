import express from 'express';
import { db } from '../db.ts';

const router = express.Router();

router.get('/health', async function(_, res, next) {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

export default router;
