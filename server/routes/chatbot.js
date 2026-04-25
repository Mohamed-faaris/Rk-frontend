import express from 'express';
import chatbotController from '../controllers/chatbotController.js';
import { protect, adminStrict } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/send', protect, chatbotController.sendMessage);
router.get('/history/:userId', protect, chatbotController.getChatHistory);
router.get('/session/:sessionId', protect, chatbotController.getSessionMessages);

// Admin routes
router.get('/admin/all', protect, adminStrict, chatbotController.getAllMessages);
router.get('/admin/stats', protect, adminStrict, chatbotController.getChatStats);
router.patch('/admin/:messageId/read', protect, adminStrict, chatbotController.markAsRead);
router.patch('/admin/session/:sessionId/resolve', protect, adminStrict, chatbotController.markAsResolved);
router.patch('/admin/:messageId/star', protect, adminStrict, chatbotController.toggleStar);

export default router;
