import crypto from 'crypto';

/**
 * Generate a secure 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateSecureOTP = () => {
  // Use crypto.randomInt for cryptographically secure random numbers
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};

/**
 * Calculate OTP expiry time (5 minutes from now)
 * @returns {Date} Expiry date
 */
export const getOTPExpiryTime = () => {
  const expiryMinutes = 5;
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
};

/**
 * Check if OTP has expired
 * @param {Date} createdAt - OTP creation timestamp
 * @returns {boolean} True if expired
 */
export const isOTPExpired = (createdAt) => {
  const expiryMinutes = 5;
  const expiryTime = new Date(createdAt.getTime() + expiryMinutes * 60 * 1000);
  return Date.now() > expiryTime.getTime();
};

/**
 * Get remaining time for OTP in seconds
 * @param {Date} createdAt - OTP creation timestamp
 * @returns {number} Remaining seconds (0 if expired)
 */
export const getOTPRemainingTime = (createdAt) => {
  const expiryMinutes = 5;
  const expiryTime = new Date(createdAt.getTime() + expiryMinutes * 60 * 1000);
  const remainingMs = expiryTime.getTime() - Date.now();
  return Math.max(0, Math.floor(remainingMs / 1000));
};

/**
 * Validate OTP format
 * @param {string} otp - OTP to validate
 * @returns {boolean} True if valid format
 */
export const isValidOTPFormat = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  return email.toLowerCase().trim();
};

/**
 * Maximum attempts allowed
 */
export const MAX_OTP_ATTEMPTS = 3;

/**
 * OTP expiry in seconds
 */
export const OTP_EXPIRY_SECONDS = 300; // 5 minutes

/**
 * Minimum time between OTP requests (to prevent spam)
 */
export const MIN_RESEND_INTERVAL_SECONDS = 60; // 1 minute
