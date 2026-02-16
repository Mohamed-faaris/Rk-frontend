import OTP from '../models/OTP.js';
import User from '../models/User.js';
import { sendOTPEmail } from '../utils/emailService.js';
import {
  generateSecureOTP,
  isOTPExpired,
  isValidOTPFormat,
  sanitizeEmail,
  MAX_OTP_ATTEMPTS,
  getOTPRemainingTime
} from '../utils/otpUtils.js';

/**
 * @desc    Send OTP to user email
 * @route   POST /api/otp/send
 * @access  Public
 */
export const sendOTP = async (req, res) => {
  try {
    const { email, purpose = 'verification' } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Check if user exists (optional - depends on your use case)
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      // For security, don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'If the email exists, an OTP has been sent'
      });
    }

    // Check for recent OTP request (rate limiting)
    const recentOTP = await OTP.findOne({ email: sanitizedEmail })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOTP && !isOTPExpired(recentOTP.createdAt)) {
      const remainingTime = getOTPRemainingTime(recentOTP.createdAt);
      if (remainingTime > 240) { // If less than 1 minute since last OTP
        return res.status(429).json({
          success: false,
          error: 'Please wait before requesting a new OTP',
          remainingTime
        });
      }
    }

    // Generate secure OTP
    const otp = generateSecureOTP();

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: sanitizedEmail });

    // Create new OTP record
    await OTP.create({
      email: sanitizedEmail,
      otp,
      purpose,
      attempts: 0,
      verified: false
    });

    // Send OTP via email
    try {
      const emailResult = await sendOTPEmail(sanitizedEmail, otp, purpose);

      // Log OTP in development (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('\n╔═══════════════════════════════════════════╗');
        console.log('║         🔐 OTP GENERATED (DEV MODE)       ║');
        console.log('╠═══════════════════════════════════════════╣');
        console.log(`║  Email: ${sanitizedEmail.padEnd(31)}║`);
        console.log(`║  OTP: ${otp}                             ║`);
        console.log(`║  Purpose: ${purpose.padEnd(27)}║`);
        console.log(`║  Expires in: 5 minutes                    ║`);
        console.log('╚═══════════════════════════════════════════╝\n');
      }

      return res.status(200).json({
        success: true,
        message: 'OTP has been sent to your email',
        expiresIn: 300, // 5 minutes in seconds
        ...(emailResult.previewUrl && { previewUrl: emailResult.previewUrl })
      });

    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      
      // Delete the OTP if email fails
      await OTP.deleteMany({ email: sanitizedEmail });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to send OTP. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while sending OTP'
    });
  }
};

/**
 * @desc    Verify OTP
 * @route   POST /api/otp/verify
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required'
      });
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Validate OTP format
    if (!isValidOTPFormat(otp)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP format. OTP must be 6 digits.'
      });
    }

    // Find the most recent OTP for this email
    const otpRecord = await OTP.findOne({ 
      email: sanitizedEmail,
      verified: false 
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'No OTP found or OTP has expired'
      });
    }

    // Check if OTP has expired
    if (isOTPExpired(otpRecord.createdAt)) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        error: 'OTP has expired. Please request a new one.'
      });
    }

    // Check if max attempts reached
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({
        success: false,
        error: 'Maximum verification attempts reached. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remainingAttempts = MAX_OTP_ATTEMPTS - otpRecord.attempts;

      return res.status(400).json({
        success: false,
        error: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
        attemptsLeft: remainingAttempts
      });
    }

    // OTP is valid - mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Delete the OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    // Get user info
    const user = await User.findOne({ email: sanitizedEmail });

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      user: user ? {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } : null
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while verifying OTP'
    });
  }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/otp/resend
 * @access  Public
 */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Check if there's an existing unverified OTP
    const existingOTP = await OTP.findOne({ 
      email: sanitizedEmail,
      verified: false 
    }).sort({ createdAt: -1 });

    if (existingOTP && !isOTPExpired(existingOTP.createdAt)) {
      // Check if minimum resend interval has passed
      const ageInSeconds = Math.floor((Date.now() - existingOTP.createdAt.getTime()) / 1000);
      if (ageInSeconds < 60) { // 1 minute cooldown
        return res.status(429).json({
          success: false,
          error: 'Please wait before requesting a new OTP',
          waitSeconds: 60 - ageInSeconds
        });
      }
    }

    // Generate new OTP
    const otp = generateSecureOTP();

    // Delete old OTPs
    await OTP.deleteMany({ email: sanitizedEmail });

    // Create new OTP
    await OTP.create({
      email: sanitizedEmail,
      otp,
      attempts: 0,
      verified: false
    });

    // Send OTP via email
    try {
      const emailResult = await sendOTPEmail(sanitizedEmail, otp);

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('\n╔═══════════════════════════════════════════╗');
        console.log('║         🔄 OTP RESENT (DEV MODE)          ║');
        console.log('╠═══════════════════════════════════════════╣');
        console.log(`║  Email: ${sanitizedEmail.padEnd(31)}║`);
        console.log(`║  OTP: ${otp}                             ║`);
        console.log(`║  Expires in: 5 minutes                    ║`);
        console.log('╚═══════════════════════════════════════════╝\n');
      }

      return res.status(200).json({
        success: true,
        message: 'New OTP has been sent to your email',
        expiresIn: 300,
        ...(emailResult.previewUrl && { previewUrl: emailResult.previewUrl })
      });

    } catch (emailError) {
      console.error('Failed to resend OTP:', emailError);
      await OTP.deleteMany({ email: sanitizedEmail });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to resend OTP. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while resending OTP'
    });
  }
};

/**
 * @desc    Check OTP status
 * @route   GET /api/otp/status/:email
 * @access  Public
 */
export const checkOTPStatus = async (req, res) => {
  try {
    const { email } = req.params;
    const sanitizedEmail = sanitizeEmail(email);

    const otpRecord = await OTP.findOne({ 
      email: sanitizedEmail,
      verified: false 
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(200).json({
        success: true,
        hasActiveOTP: false
      });
    }

    const isExpired = isOTPExpired(otpRecord.createdAt);
    const remainingTime = getOTPRemainingTime(otpRecord.createdAt);

    if (isExpired) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(200).json({
        success: true,
        hasActiveOTP: false
      });
    }

    return res.status(200).json({
      success: true,
      hasActiveOTP: true,
      remainingTime,
      attemptsLeft: MAX_OTP_ATTEMPTS - otpRecord.attempts
    });

  } catch (error) {
    console.error('Check OTP status error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while checking OTP status'
    });
  }
};
