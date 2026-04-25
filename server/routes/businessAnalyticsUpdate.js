import express from 'express';
import {
  listPublishedBusinessAnalyticsUpdates,
  getBusinessAnalyticsUpdateById,
  createBusinessAnalyticsUpdate,
  updateBusinessAnalyticsUpdate,
  deleteBusinessAnalyticsUpdate
} from '../controllers/businessAnalyticsUpdateController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listPublishedBusinessAnalyticsUpdates);
router.get('/:id', getBusinessAnalyticsUpdateById);

router.post('/', protect, authorize('admin', 'ceo', 'finance_analyst'), createBusinessAnalyticsUpdate);
router.put('/:id', protect, authorize('admin', 'ceo', 'finance_analyst'), updateBusinessAnalyticsUpdate);
router.delete('/:id', protect, authorize('admin', 'ceo', 'finance_analyst'), deleteBusinessAnalyticsUpdate);

export default router;
