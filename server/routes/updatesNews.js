import express from 'express';
import {
  listPublishedUpdatesNews,
  listAllUpdatesNews,
  getUpdatesNewsById,
  createUpdatesNews,
  updateUpdatesNews,
  deleteUpdatesNews
} from '../controllers/updatesNewsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listPublishedUpdatesNews);
router.get('/admin/all', protect, authorize('admin'), listAllUpdatesNews);
router.get('/:id', getUpdatesNewsById);

router.post('/', protect, authorize('admin'), createUpdatesNews);
router.put('/:id', protect, authorize('admin'), updateUpdatesNews);
router.delete('/:id', protect, authorize('admin'), deleteUpdatesNews);

export default router;