import { Router } from 'express';

import { createBook } from './create/controller.ts';
import { deleteBook } from './delete/controller.ts';
import { getBook } from './details/controller.ts';
import { getBooksList } from './list/controller.ts';
import { updateBook } from './update/controller.ts';
import {
  validateBookCreateMultipart,
  validateBookPatchMultipart,
} from '../middleware/multipart.ts';
import { authenticate } from '../../auth/middleware/authenticate.ts';

const router = Router();

router.get('/books', getBooksList);
router.post('/books', authenticate, ...validateBookCreateMultipart, createBook);
router.get('/books/:id', getBook);
router.patch(
  '/books/:id',
  authenticate,
  ...validateBookPatchMultipart,
  updateBook
);
router.delete('/books/:id', authenticate, deleteBook);

export default router;
