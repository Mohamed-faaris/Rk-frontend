import express from 'express';
import multer from 'multer';
import {
  submitApplication,
  submitPositionApplication,
  getAllApplications,
  getApplicationById,
  acceptApplication,
  rejectApplication,
  deleteApplication
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.post('/apply', upload.fields([
  { name: 'resumeFile', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), submitApplication);
router.post('/apply-position', (req, res, next) => {
  console.log('Route /apply-position hit');
  next();
}, upload.fields([
  { name: 'resumeFile', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), submitPositionApplication);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 100MB.' });
    }
    return res.status(400).json({ error: `File upload error: ${error.message}` });
  } else if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

// Admin routes
router.use(protect); // Add protect middleware for all admin routes
router.get('/', admin, getAllApplications);
router.get('/:id', admin, getApplicationById);
router.put('/:id/accept', admin, acceptApplication);
router.put('/:id/reject', admin, rejectApplication);
router.delete('/:id', admin, deleteApplication);

export default router;
