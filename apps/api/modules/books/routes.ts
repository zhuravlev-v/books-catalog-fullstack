import { Router } from 'express';

import { getBooksList } from './list/controller.ts';

const router = Router();

router.get('/books', getBooksList);

export default router;
