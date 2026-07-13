import express from 'express';
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsAdmin,
  updateReviewStatus,
  getMyReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getReviews);

// Private routes (requires login)
router.use(protect);
router.get('/my-review', getMyReview);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllReviewsAdmin);
router.patch('/:id/status', authorize('admin'), updateReviewStatus);

// Single review (public)
router.get('/:id', getReview);

export default router;
