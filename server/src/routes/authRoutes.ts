import express from 'express';
import { register, login, getMe } from '../controllers/authController.ts';
import { authenticate } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

export default router;