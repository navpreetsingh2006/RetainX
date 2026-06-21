import express from 'express';
import { authenticate } from '../middleware/authMiddleware.ts';
import {
  getDashboard,
  triggerNudge,
  exportCustomers,
  getPrediction,
} from '../controllers/dashboardController.ts';

const router = express.Router();

router.use(authenticate);

router.get('/', getDashboard);
router.post('/predict', getPrediction);
router.post('/customers/:id/trigger', triggerNudge);
router.get('/export', exportCustomers);

export default router;
