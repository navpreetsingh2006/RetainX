import express from 'express';
import {
  submitContact,
  subscribeNewsletter,
  getPlatformStats,
} from '../controllers/publicController.ts';

const router = express.Router();

router.post('/contact', submitContact);
router.post('/newsletter', subscribeNewsletter);
router.get('/stats', getPlatformStats);

export default router;
