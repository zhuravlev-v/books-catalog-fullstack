import { Router } from 'express';
import { getAuthors } from './list/controller.ts';

const router = Router();

router.get('/', getAuthors);

export default router;
