import { Router } from 'express';

import controller from './books.controller.ts';

const router = Router();

router.get('/books', controller.getAllBooks);

export default router;
