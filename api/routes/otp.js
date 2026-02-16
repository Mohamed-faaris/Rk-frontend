import express from 'express';
import {
  sendOTP,
  verifyOTP,
  resendOTP,
  checkOTPStatus
} from '../controllers/otpController.js';

const router = express.Router();

// Send OTP to email
router.post('/send', sendOTP);

// Verify OTP
router.post('/verify', verifyOTP);

// Resend OTP
router.post('/resend', resendOTP);

// Check OTP status
router.get('/status/:email', checkOTPStatus);

export default router;
