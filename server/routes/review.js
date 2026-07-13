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

// ── Fully Public (no auth required) ─────────────────────────────────────────
router.get('/', getReviews);            // Everyone sees all approved reviews
router.get('/:id', getReview);          // Anyone can read a single review

// ── Protected (login required) ───────────────────────────────────────────────
router.get('/user/my-review', protect, getMyReview);      // Get own review
router.post('/', protect, createReview);                  // Submit a review
router.put('/:id', protect, updateReview);                // Edit own review
router.delete('/:id', protect, deleteReview);             // Delete own review

// ── Admin only ───────────────────────────────────────────────────────────────
router.get('/admin/all', protect, authorize('admin'), getAllReviewsAdmin);
router.patch('/:id/status', protect, authorize('admin'), updateReviewStatus);

export default router;
