import { Router } from 'express';

import { authenticate } from '../../auth/middleware/authenticate.ts';
import { createAuthor } from './create/controller.ts';
import { deleteAuthor } from './delete/controller.ts';
import { getAuthor } from './details/controller.ts';
import { getAuthors } from './list/controller.ts';
import { updateAuthor } from './update/controller.ts';

const router = Router();

router.get('/', getAuthors);
router.post('/', authenticate, createAuthor);
router.get('/:id', getAuthor);
router.patch('/:id', authenticate, updateAuthor);
router.delete('/:id', authenticate, deleteAuthor);

export default router;
