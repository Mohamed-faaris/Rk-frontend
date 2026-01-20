import express from 'express';
import chatbotController from '../controllers/chatbotController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/send', protect, chatbotController.sendMessage);
router.get('/history/:userId', protect, chatbotController.getChatHistory);
router.get('/session/:sessionId', protect, chatbotController.getSessionMessages);

// Admin routes
router.get('/admin/all', protect, admin, chatbotController.getAllMessages);
router.get('/admin/stats', protect, admin, chatbotController.getChatStats);
router.patch('/admin/:messageId/read', protect, admin, chatbotController.markAsRead);
router.patch('/admin/session/:sessionId/resolve', protect, admin, chatbotController.markAsResolved);
router.patch('/admin/:messageId/star', protect, admin, chatbotController.toggleStar);

export default router;
