import nodemailer from 'nodemailer';
import { env } from '../env.js';

const createTransporter = async () => {
  if (env.EMAIL_SERVICE === 'gmail' && 
      env.EMAIL_USER && 
      env.EMAIL_PASSWORD && 
      env.EMAIL_PASSWORD !== 'your-app-password-here') {
    
    console.log('📧 Using Gmail SMTP for sending OTP emails');
    console.log('   Email:', env.EMAIL_USER);
    console.log('   Environment:', process.env.VERCEL ? 'Vercel' : 'Local');
    
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      },
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

// Send application accepted email
export const sendApplicationAcceptedEmail = async (email, name, position, department, salary, joiningDate, adminNotes) => {
  try {
    const transporter = await createTransporter();

    const formattedDate = joiningDate
      ? new Date(joiningDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'To be communicated';

    const formattedSalary = salary
      ? `₹${Number(salary).toLocaleString('en-IN')} per month`
      : 'To be communicated';

    const mailOptions = {
      from: env.EMAIL_FROM || '"RajKayal Creative Hub" <noreply@rajkayal.com>',
      to: email,
      subject: '🎉 Congratulations! Your Application Has Been Accepted — RajKayal Creative Hub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; background-color: #0f0f0f; color: #ffffff; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #D4AF37, #FFD700); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: #D4AF37;">RajKayal</div>
              <p style="color: #a0a0a0; margin: 4px 0 0;">Creative Hub</p>
            </div>

            <!-- Card -->
            <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 40px;">

              <!-- Badge -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); color: #000; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; padding: 6px 20px; border-radius: 50px; text-transform: uppercase;">Application Accepted</span>
              </div>

              <h2 style="color: #D4AF37; text-align: center; margin: 0 0 16px;">Congratulations, ${name}! 🎊</h2>

              <p style="color: #c0c0c0; line-height: 1.7; text-align: center; margin: 0 0 28px;">
                We are thrilled to inform you that your application to <strong style="color: #ffffff;">RajKayal Creative Hub</strong> has been <strong style="color: #4ade80;">accepted</strong>. We were truly impressed by your profile and look forward to having you as part of our team.
              </p>

              <!-- Details Table -->
              <div style="background: #111; border: 1px solid #2a2a2a; border-radius: 10px; padding: 24px; margin-bottom: 28px;">
                <h3 style="color: #D4AF37; margin: 0 0 16px; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">Your Offer Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #a0a0a0; padding: 10px 0; border-bottom: 1px solid #222; font-size: 14px; width: 45%;">Position</td>
                    <td style="color: #ffffff; padding: 10px 0; border-bottom: 1px solid #222; font-size: 14px; font-weight: 600;">${position}</td>
                  </tr>
                  <tr>
                    <td style="color: #a0a0a0; padding: 10px 0; border-bottom: 1px solid #222; font-size: 14px;">Department</td>
                    <td style="color: #ffffff; padding: 10px 0; border-bottom: 1px solid #222; font-size: 14px; font-weight: 600;">${department}</td>
                  </tr>
                  <tr>
                    <td style="color: #a0a0a0; padding: 10px 0; border-bottom: 1px solid #222; font-size: 14px;">Salary</td>
                    <td style="color: #4ade80; padding: 10px 0; border-bottom: 1px solid #222; font-size: 14px; font-weight: 600;">${formattedSalary}</td>
                  </tr>
                  <tr>
                    <td style="color: #a0a0a0; padding: 10px 0; font-size: 14px;">Joining Date</td>
                    <td style="color: #ffffff; padding: 10px 0; font-size: 14px; font-weight: 600;">${formattedDate}</td>
                  </tr>
                </table>
              </div>

              ${adminNotes ? `
              <!-- Admin Notes -->
              <div style="background: #0d1a0d; border: 1px solid #1a3a1a; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
                <h3 style="color: #4ade80; margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Message from HR</h3>
                <p style="color: #c0c0c0; line-height: 1.6; margin: 0; font-size: 14px;">${adminNotes}</p>
              </div>
              ` : ''}

              <!-- Next Steps -->
              <div style="background: #111; border-left: 3px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 28px;">
                <h3 style="color: #D4AF37; margin: 0 0 10px; font-size: 14px;">Next Steps</h3>
                <p style="color: #a0a0a0; margin: 0; font-size: 13px; line-height: 1.6;">Our HR team will reach out to you shortly with further onboarding details. Please keep an eye on this email address for follow-up communications.</p>
              </div>

              <p style="color: #a0a0a0; text-align: center; font-size: 14px; line-height: 1.6; margin: 0;">
                Once again, welcome aboard! We are excited to build something great together at <strong style="color: #D4AF37;">RajKayal Creative Hub</strong>.
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; color: #555; font-size: 12px; line-height: 1.8;">
              <p style="margin: 0;">© ${new Date().getFullYear()} RajKayal Creative Hub. All rights reserved.</p>
              <p style="margin: 4px 0 0;">This is an automated message — please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Application accepted email sent to:', email, '| MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending application accepted email:', error.message);
    // Non-fatal: don't rethrow so the main accept flow still succeeds
  }
};

// Send application rejected email
export const sendApplicationRejectedEmail = async (email, name, position, department, adminNotes) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: env.EMAIL_FROM || '"RajKayal Creative Hub" <noreply@rajkayal.com>',
      to: email,
      subject: 'Update on Your Application — RajKayal Creative Hub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; background-color: #0f0f0f; color: #ffffff; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #D4AF37, #FFD700); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: #D4AF37;">RajKayal</div>
              <p style="color: #a0a0a0; margin: 4px 0 0;">Creative Hub</p>
            </div>

            <!-- Card -->
            <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 40px;">

              <!-- Badge -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="display: inline-block; background: #2a1a1a; color: #f87171; border: 1px solid #3a1a1a; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; padding: 6px 20px; border-radius: 50px; text-transform: uppercase;">Application Status Update</span>
              </div>

              <h2 style="color: #f0f0f0; text-align: center; margin: 0 0 16px;">Dear ${name},</h2>

              <p style="color: #c0c0c0; line-height: 1.7; text-align: center; margin: 0 0 28px;">
                Thank you sincerely for taking the time to apply for the <strong style="color: #ffffff;">${position}</strong> role at <strong style="color: #D4AF37;">RajKayal Creative Hub</strong>. We genuinely appreciate your interest in joining our team.
              </p>

              <!-- Status Box -->
              <div style="background: #1a1010; border: 1px solid #3a2020; border-radius: 10px; padding: 24px; margin-bottom: 28px; text-align: center;">
                <p style="color: #a0a0a0; font-size: 14px; margin: 0 0 8px;">Position Applied For</p>
                <p style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0 0 4px;">${position}</p>
                <p style="color: #888; font-size: 13px; margin: 0 0 16px;">${department} Department</p>
                <p style="color: #c0c0c0; font-size: 14px; line-height: 1.6; margin: 0;">
                  After careful consideration of all candidates, we regret to inform you that we will not be moving forward with your application at this time. This was a difficult decision given the high quality of candidates we received.
                </p>
              </div>

              ${adminNotes ? `
              <!-- Admin Notes / Feedback -->
              <div style="background: #111; border: 1px solid #2a2a2a; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
                <h3 style="color: #D4AF37; margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Feedback from Our Team</h3>
                <p style="color: #c0c0c0; line-height: 1.6; margin: 0; font-size: 14px;">${adminNotes}</p>
              </div>
              ` : ''}

              <!-- Encouragement -->
              <div style="background: #111; border-left: 3px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 28px;">
                <h3 style="color: #D4AF37; margin: 0 0 10px; font-size: 14px;">Keep Going 💛</h3>
                <p style="color: #a0a0a0; margin: 0; font-size: 13px; line-height: 1.6;">
                  We strongly encourage you to apply again in the future as new opportunities arise. Your skills and enthusiasm are valued, and we hope our paths cross again someday.
                </p>
              </div>

              <p style="color: #a0a0a0; text-align: center; font-size: 14px; line-height: 1.6; margin: 0;">
                We wish you all the very best in your career journey and future endeavors. Thank you once more for your interest in <strong style="color: #D4AF37;">RajKayal Creative Hub</strong>.
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; color: #555; font-size: 12px; line-height: 1.8;">
              <p style="margin: 0;">© ${new Date().getFullYear()} RajKayal Creative Hub. All rights reserved.</p>
              <p style="margin: 4px 0 0;">This is an automated message — please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Application rejected email sent to:', email, '| MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending application rejected email:', error.message);
    // Non-fatal: don't rethrow so the main reject flow still succeeds
  }
};

// Send order status update email
export const sendOrderStatusUpdateEmail = async ({
  email,
  name,
  orderTitle,
  orderService,
  previousStatus,
  currentStatus,
  adminNotes,
  orderId
}) => {
  try {
    const transporter = await createTransporter();

    const prettifyStatus = (status) =>
      String(status || '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const mailOptions = {
      from: env.EMAIL_FROM || '"RajKayal Creative Hub" <noreply@rajkayal.com>',
      to: email,
      subject: `Order Status Updated: ${prettifyStatus(currentStatus)} - RajKayal Creative Hub`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #0f0f0f; color: #ffffff; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 30px 16px;">
            <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 28px;">
              <h2 style="margin: 0 0 12px; color: #D4AF37;">Order Status Update</h2>
              <p style="margin: 0 0 20px; color: #cfcfcf; line-height: 1.6;">
                Hello ${name || 'Customer'}, your order status has been updated.
              </p>

              <div style="background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px;">
                <p style="margin: 0 0 8px; color: #a0a0a0; font-size: 13px;">Order</p>
                <p style="margin: 0 0 6px; color: #fff; font-size: 16px; font-weight: 700;">${orderTitle || 'Untitled Order'}</p>
                <p style="margin: 0; color: #a0a0a0; font-size: 13px;">Service: ${orderService || 'N/A'}</p>
                ${orderId ? `<p style="margin: 8px 0 0; color: #777; font-size: 12px;">Order ID: ${orderId}</p>` : ''}
              </div>

              <div style="background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px;">
                <p style="margin: 0 0 8px; color: #a0a0a0; font-size: 13px;">Status Change</p>
                <p style="margin: 0; color: #fff; font-size: 14px;">
                  ${prettifyStatus(previousStatus)} -> <strong style="color: #D4AF37;">${prettifyStatus(currentStatus)}</strong>
                </p>
              </div>

              ${adminNotes ? `
                <div style="background: #111; border-left: 3px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 12px 14px; margin-bottom: 16px;">
                  <p style="margin: 0 0 6px; color: #D4AF37; font-size: 13px;">Admin Notes</p>
                  <p style="margin: 0; color: #cfcfcf; font-size: 13px; line-height: 1.6;">${adminNotes}</p>
                </div>
              ` : ''}

              <p style="margin: 0; color: #9a9a9a; font-size: 12px;">This is an automated update from RajKayal Creative Hub.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order status update email sent to:', email, '| MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order status update email:', error.message);
    // Non-fatal: do not block status update API response
  }
};

export default {
  sendOTPEmail,
  sendWelcomeEmail,
  sendApplicationAcceptedEmail,
  sendApplicationRejectedEmail,
  sendOrderStatusUpdateEmail,
  verifyEmailConnection
};
