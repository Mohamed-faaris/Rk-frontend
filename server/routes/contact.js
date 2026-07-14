import express from 'express';
import {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  replyToContact
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', createContact);

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), getAllContacts);
router.get('/:id', protect, authorize('admin'), getContact);
router.put('/:id', protect, authorize('admin'), updateContact);
router.post('/:id/reply', protect, authorize('admin'), replyToContact);
router.delete('/:id', protect, authorize('admin'), deleteContact);

export default router;
