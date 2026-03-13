import express from 'express';
import {
  submitApplication,
  submitPositionApplication,
  getAllApplications,
  getMyApplicationStatus,
  getApplicationById,
  downloadApplicationResume,
  acceptApplication,
  rejectApplication,
  deleteApplication
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/apply', submitApplication);
router.post('/apply-position', submitPositionApplication);

// Admin routes
router.use(protect); // Add protect middleware for all admin routes
router.get('/my-status', getMyApplicationStatus);
router.get('/', admin, getAllApplications);
router.get('/:id/resume', admin, downloadApplicationResume);
router.get('/:id', admin, getApplicationById);
router.put('/:id/accept', admin, acceptApplication);
router.put('/:id/reject', admin, rejectApplication);
router.delete('/:id', admin, deleteApplication);

export default router;
