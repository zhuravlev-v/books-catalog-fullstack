import { Router } from 'express';

import { getBooksList } from './list/controller.ts';
import { getBook } from './details/controller.ts';

const router = Router();

router.get('/books', getBooksList);
router.get('/books/:id', getBook);

export default router;
