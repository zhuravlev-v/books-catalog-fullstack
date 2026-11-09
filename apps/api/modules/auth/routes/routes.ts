import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.ts';
import login from './login/controller.ts';
import logout from './logout/controller.ts';
import refresh from './refresh/controller.ts';
import register from './register/controller.ts';
import getCurrentSession from './session/controller.ts';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);
router.get('/session', authenticate, getCurrentSession);
router.post('/logout', logout);

export default router;
