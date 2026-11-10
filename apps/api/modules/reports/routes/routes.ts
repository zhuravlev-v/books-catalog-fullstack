import { Router } from 'express';

import { getTopAuthors } from './top-authors/controller.ts';

const router = Router();

router.get('/top-authors', getTopAuthors);

export default router;
