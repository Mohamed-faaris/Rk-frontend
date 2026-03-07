import nodemailer from 'nodemailer';

// Create transporter with SMTP configuration
const createTransporter = async () => {
  // Check if Gmail SMTP is properly configured
  if (process.env.EMAIL_SERVICE === 'gmail' && 
      process.env.EMAIL_USER && 
      process.env.EMAIL_PASSWORD && 
      process.env.EMAIL_PASSWORD !== 'your-app-password-here') {
    
    console.log('📧 Using Gmail SMTP for sending OTP emails');
    console.log('   Email:', process.env.EMAIL_USER);
    console.log('   Environment:', process.env.VERCEL ? 'Vercel' : 'Local');
    
    // Configure SMTP transport (similar to Java SMTP configuration)
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, // TLS port
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
      },
      tls: {
        // Do not fail on invalid certificates
        rejectUnauthorized: false
      },
      // Additional settings for reliability
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5
    });
  }
  
  // In production/Vercel, don't allow fallback to Ethereal
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
  
  if (isProduction) {
    console.error('❌ CRITICAL: Gmail SMTP NOT configured in production!');
    console.error('   Environment variables missing. Email service disabled.');
    console.error('   Add EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWORD in Vercel Dashboard');
    throw new Error('Email service not configured. Please contact administrator.');
  }
  
  // Fallback to ethereal for LOCAL testing only
  console.log('⚠️ Gmail SMTP not configured - Using Ethereal (test email - LOCAL DEV ONLY)');
  console.log('💡 To use real Gmail SMTP:');
  console.log('   1. Set EMAIL_SERVICE=gmail');
  console.log('   2. Set EMAIL_USER=your-email@gmail.com');
  console.log('   3. Set EMAIL_PASSWORD=your-16-char-app-password');
  console.log('   4. For Vercel: Add these in Dashboard → Settings → Environment Variables');
  
  const testAccount = await nodemailer.createTestAccount();
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

// Verify SMTP connection
export const verifyEmailConnection = async () => {
  try {
    const transporter = await createTransporter();
    const verification = await transporter.verify();
    
    if (verification) {
      console.log('✅ SMTP Server is ready to send emails');
      return { success: true, message: 'SMTP connection verified' };
    }
  } catch (error) {
    console.error('❌ SMTP Connection Error:', error.message);
    return { success: false, error: error.message };
  }
};

// Send OTP email
export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  try {
    const transporter = await createTransporter();
    
    // Verify connection before sending
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError.message);
      throw new Error('Email service is not available. Please try again later.');
    }
    
    // Determine subject based on purpose
    const subjects = {
      'login': 'Your Admin Login OTP - RajKayal Creative Hub',
      'registration': 'Verify Your Email - RajKayal Creative Hub',
      'verification': 'Your Verification OTP - RajKayal Creative Hub',
      'password-reset': 'Password Reset OTP - RajKayal Creative Hub'
    };
    
    const subject = subjects[purpose] || subjects['verification'];
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"RajKayal Creative Hub" <noreply@rajkayal.com>',
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              background-color: #0f0f0f;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              background: linear-gradient(135deg, #D4AF37, #FFD700);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .content {
              background: #1a1a1a;
              border: 1px solid #333;
              border-radius: 12px;
              padding: 40px;
              text-align: center;
            }
            .otp-box {
              background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
              color: #000;
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
              display: inline-block;
            }
            .message {
              color: #a0a0a0;
              line-height: 1.6;
              margin: 20px 0;
            }
            .warning {
              color: #ff6b6b;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">RajKayal</div>
              <p style="color: #a0a0a0;">Creative Hub</p>
            </div>
            
            <div class="content">
              <h2 style="color: #D4AF37; margin-top: 0;">Email Verification</h2>
              
              <p class="message">
                Please use the following OTP to verify your action:
              </p>
              
              <div class="otp-box">${otp}</div>
              
              <p class="message">
                This code will expire in <strong>5 minutes</strong>.<br>
                Do not share this code with anyone.
              </p>
              
              <p class="warning">
                ⚠️ If you did not request this code, please ignore this email<br>
                and ensure your account is secure.
              </p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} RajKayal Creative Hub. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n✉️  OTP Email sent successfully via SMTP!');
    console.log('   Message ID:', info.messageId);
    console.log('   Recipient:', email);
    console.log('   Response:', info.response);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('   📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    console.log('');
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    
    // Provide specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your email credentials.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to email server. Please check your internet connection.');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Email server connection timed out. Please try again.');
    } else {
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }
};

// Send welcome email (optional)
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"RajKayal Creative Hub" <noreply@rajkayal.com>',
      to: email,
      subject: 'Welcome to RajKayal Creative Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Welcome, ${name}!</h2>
          <p>Thank you for joining RajKayal Creative Hub.</p>
          <p>We're excited to have you on board!</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

export default { sendOTPEmail, sendWelcomeEmail, verifyEmailConnection };
