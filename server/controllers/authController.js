import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import appleSigninAuth from 'apple-signin-auth';
import nodeFetch from 'node-fetch';
import { sendOTPEmail } from '../utils/emailService.js';
import { generateSecureOTP } from '../utils/otpUtils.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rajkayal_creative_hub_secret_key_2025';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_GRAPH_VERSION = process.env.FACEBOOK_GRAPH_VERSION || 'v19.0';

const httpFetch = typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : nodeFetch;

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    console.log('Register attempt:', { name, email, phone, passwordLength: password?.length });

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    console.log('User created successfully:', { email: user.email, id: user._id });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, passwordLength: password?.length });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User found:', { email: user.email, hasPassword: !!user.password });

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is admin - if yes, check if OTP should be skipped
    const skipOTP = process.env.SKIP_OTP === 'true'; // Allow skipping via ENV
    
    console.log('OTP Check:', { 
      isAdmin: user.role === 'admin', 
      skipOTP, 
      SKIP_OTP_env: process.env.SKIP_OTP,
      NODE_ENV: process.env.NODE_ENV 
    });
    

    // OTP Verification for admin
    if (user.role === 'admin' && !skipOTP) {
        const { otp } = req.body;

        // If OTP is provided, verify it
        if (otp) {
            console.log('Verifying OTP for admin:', user.email);
            
            // Find most recent OTP for this email
            const recentOTP = await OTP.findOne({ email: user.email })
                .sort({ createdAt: -1 });

            if (!recentOTP) {
                return res.status(400).json({ error: 'OTP expired or not found. Please request a new one.' });
            }

            if (recentOTP.verified) {
                 return res.status(400).json({ error: 'OTP already used' });
            }

            if (recentOTP.otp !== otp) {
                // Increment attempts
            recentOTP.attempts += 1;
            await recentOTP.save();
            
            if (recentOTP.attempts >= 3) {
                await OTP.deleteOne({ _id: recentOTP._id });
                return res.status(400).json({ error: 'Too many failed attempts. Please request a new OTP.' });
            }
            
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        
        // Check expiry
        const expiryTime = new Date(recentOTP.createdAt.getTime() + 5 * 60000); // 5 minutes
        if (Date.now() > expiryTime) {
            return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
        }

        // Mark OTP as verified by deleting it
        await OTP.deleteOne({ _id: recentOTP._id });
        console.log('OTP verified successfully');
        
        // Allow execution to continue to token generation
    } else {
        // No OTP provided, generate and send one
            console.log('Admin login detected, generating OTP for:', user.email);
            
            const generatedOTP = generateSecureOTP();
            
            // Delete any existing OTPs for cleanliness
            await OTP.deleteMany({ email: user.email });

            await OTP.create({
                email: user.email,
                otp: generatedOTP,
                purpose: 'login'
            });

            // Send email
            try {
                const emailResult = await sendOTPEmail(user.email, generatedOTP, 'login');
                return res.status(200).json({
                    success: true,
                    requiresOTP: true,
                    email: user.email,
                    message: 'OTP sent to your email',
                    ...(emailResult && emailResult.previewUrl && { previewUrl: emailResult.previewUrl })
                });
            } catch (emailError) {
                console.error('Failed to send OTP email:', emailError);
                return res.status(500).json({ error: 'Failed to send verification email' });
            }
        }
    }
    
    // Generate token and proceed with normal login
    const token = generateToken(user._id, user.role);

    console.log('Login successful for:', email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Verify OTP for admin login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    console.log('OTP verification attempt:', { email, otp, timestamp: new Date().toISOString() });

    if (!email || !otp) {
      return res.status(400).json({ error: 'Please provide email and OTP' });
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });

    console.log('OTP record found:', otpRecord ? {
      email: otpRecord.email,
      otp: otpRecord.otp,
      createdAt: otpRecord.createdAt,
      verified: otpRecord.verified,
      attempts: otpRecord.attempts,
      ageInSeconds: Math.floor((Date.now() - otpRecord.createdAt.getTime()) / 1000)
    } : 'null');

    if (!otpRecord) {
      console.log('Invalid OTP for:', email);
      console.log('Checking all OTP records for this email...');
      const allOtps = await OTP.find({ email }).sort({ createdAt: -1 });
      console.log('All OTPs for email:', allOtps.map(o => ({
        otp: o.otp,
        createdAt: o.createdAt,
        ageInSeconds: Math.floor((Date.now() - o.createdAt.getTime()) / 1000)
      })));
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Check if OTP is already verified
    if (otpRecord.verified) {
      return res.status(400).json({ error: 'OTP already used' });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ error: 'Too many attempts. Please request a new OTP' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(401).json({ 
        error: 'Invalid OTP',
        attemptsLeft: 5 - otpRecord.attempts 
      });
    }
    
    // Check purpose - only allow login if purpose matches or is undefined (legacy)
    if (otpRecord.purpose && otpRecord.purpose !== 'login' && otpRecord.purpose !== 'verification') {
       return res.status(401).json({ error: 'Invalid OTP type' });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Get user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    console.log('OTP verified successfully for:', email);

    // Delete the OTP record after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please provide email' });
    }

    // Check if user exists and is admin
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new secure OTP
    const otp = generateSecureOTP();

    // Delete old OTPs
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ 
      email, 
      otp,
      attempts: 0,
      verified: false
    });

    // Send OTP via email
    try {
      const emailResult = await sendOTPEmail(email, otp, 'login');
      
      console.log(`✅ OTP resent successfully to: ${email}`);
      
      // Display OTP in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('\n╔═══════════════════════════════════════════╗');
        console.log('║         🔄 OTP RESENT (DEV MODE)          ║');
        console.log('╠═══════════════════════════════════════════╣');
        console.log(`║  Email: ${email.padEnd(31)}║`);
        console.log(`║  OTP: ${otp}                             ║`);
        console.log(`║  Valid for: 5 minutes                     ║`);
        console.log('╚═══════════════════════════════════════════╝\n');
      }
      
      res.status(200).json({
        success: true,
        message: `New OTP has been sent to ${email}`,
        previewUrl: emailResult.previewUrl
      });
    } catch (emailError) {
      console.error('Failed to resend OTP:', emailError);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Development/Test Mode: Allow mock login for testing UI
    if (idToken === 'mock-google-token' && process.env.NODE_ENV === 'development') {
      let user = await User.findOne({ email: 'test-google@rkch.dev' });
      if (!user) {
        user = await User.create({
          name: 'Test Google User',
          email: 'test-google@rkch.dev',
          password: crypto.randomBytes(16).toString('hex'),
          role: 'user'
        });
      }
      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    if (!googleClient) {
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }

    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || payload?.email?.split('@')[0];
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified) {
      return res.status(401).json({ error: 'Google email not verified' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name,
        email,
        password: randomPassword,
        role: 'user'
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(401).json({ error: 'Google authentication failed' });
  }
};

// @desc    Apple OAuth login
// @route   POST /api/auth/apple
// @access  Public
export const appleLogin = async (req, res) => {
  try {
    const { idToken, fullName } = req.body;

    // Development/Test Mode: Allow mock login for testing UI
    if (idToken === 'mock-apple-token' && process.env.NODE_ENV === 'development') {
      let user = await User.findOne({ email: 'test-apple@rkch.dev' });
      if (!user) {
        user = await User.create({
          name: 'Test Apple User',
          email: 'test-apple@rkch.dev',
          password: crypto.randomBytes(16).toString('hex'),
          role: 'user'
        });
      }
      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    if (!APPLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Apple OAuth not configured' });
    }

    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' });
    }

    const appleUser = await appleSigninAuth.verifyIdToken(idToken, {
      audience: APPLE_CLIENT_ID,
      ignoreExpiration: false
    });

    const appleEmail = appleUser?.email;
    const appleSub = appleUser?.sub;

    if (!appleEmail && !appleSub) {
      return res.status(401).json({ error: 'Apple authentication failed' });
    }

    const derivedEmail = (appleEmail || `${appleSub}@appleuser.rkch`).toLowerCase();
    const sanitizedName = (typeof fullName === 'string' && fullName.trim().length > 0)
      ? fullName.trim()
      : (appleUser?.name || appleEmail?.split('@')[0] || 'Apple User');

    let user = await User.findOne({ email: derivedEmail });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name: sanitizedName,
        email: derivedEmail,
        password: randomPassword,
        role: 'user'
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Apple login error:', error);
    return res.status(401).json({ error: 'Apple authentication failed' });
  }
};

// @desc    Facebook OAuth login
// @route   POST /api/auth/facebook
// @access  Public
export const facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    // Development/Test Mode: Allow mock login for testing UI
    if (accessToken === 'mock-facebook-token' && process.env.NODE_ENV === 'development') {
      let user = await User.findOne({ email: 'test-facebook@rkch.dev' });
      if (!user) {
        user = await User.create({
          name: 'Test Facebook User',
          email: 'test-facebook@rkch.dev',
          password: crypto.randomBytes(16).toString('hex'),
          role: 'user'
        });
      }
      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
      return res.status(500).json({ error: 'Facebook OAuth not configured' });
    }

    if (!accessToken) {
      return res.status(400).json({ error: 'Missing accessToken' });
    }

    const appAccessToken = `${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;
    const graphVersion = FACEBOOK_GRAPH_VERSION || 'v19.0';

    const debugResponse = await httpFetch(
      `https://graph.facebook.com/${graphVersion}/debug_token?input_token=${accessToken}&access_token=${appAccessToken}`
    );
    const debugData = await debugResponse.json();

    if (!debugResponse.ok || !debugData?.data?.is_valid) {
      return res.status(401).json({ error: 'Invalid Facebook token' });
    }

    const profileResponse = await httpFetch(
      `https://graph.facebook.com/${graphVersion}/me?fields=id,name,email&access_token=${accessToken}`
    );
    const profileData = await profileResponse.json();

    if (!profileResponse.ok || !profileData?.id) {
      return res.status(401).json({ error: 'Facebook authentication failed' });
    }

    const resolvedEmail = (profileData.email || `${profileData.id}@facebookuser.rkch`).toLowerCase();
    const resolvedName = profileData.name || 'Facebook User';

    let user = await User.findOne({ email: resolvedEmail });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name: resolvedName,
        email: resolvedEmail,
        password: randomPassword,
        role: 'user'
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Facebook login error:', error);
    return res.status(401).json({ error: 'Facebook authentication failed' });
  }
};
