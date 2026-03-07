// ============================================
// SMTP Configuration Test Script
// ============================================
// 
// This script tests your Gmail SMTP configuration
// Run: node server/test-smtp.js
//
// ============================================

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyEmailConnection, sendOTPEmail } from './utils/emailService.js';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment
dotenv.config({ path: path.join(__dirname, '../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function testSMTP() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║         Gmail SMTP Configuration Test                ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  // Display current configuration
  console.log('📋 Current Configuration:');
  console.log('   EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'Not set');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
  console.log('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '****' + process.env.EMAIL_PASSWORD.slice(-4) : 'Not set');
  console.log('   EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');
  console.log('');

  // Check if Gmail is configured
  if (process.env.EMAIL_SERVICE !== 'gmail' || 
      !process.env.EMAIL_USER || 
      !process.env.EMAIL_PASSWORD ||
      process.env.EMAIL_PASSWORD === 'your-app-password-here') {
    console.log('⚠️  Gmail SMTP is not configured!');
    console.log('');
    console.log('To configure Gmail SMTP:');
    console.log('1. Edit your .env file');
    console.log('2. Set EMAIL_SERVICE=gmail');
    console.log('3. Set EMAIL_USER=your-email@gmail.com');
    console.log('4. Set EMAIL_PASSWORD=your-app-password (16 chars from Google)');
    console.log('');
    console.log('📖 See SMTP_SETUP_GUIDE.md for detailed instructions');
    console.log('');
    rl.close();
    return;
  }

  // Step 1: Verify SMTP connection
  console.log('🔍 Step 1: Verifying SMTP connection...\n');
  const verification = await verifyEmailConnection();
  
  if (!verification.success) {
    console.log('\n❌ SMTP Connection Failed!');
    console.log('   Error:', verification.error);
    console.log('');
    console.log('Common issues:');
    console.log('   • App password is incorrect (regenerate it)');
    console.log('   • 2-Factor Authentication not enabled');
    console.log('   • Network/firewall blocking port 587');
    console.log('   • Email address is incorrect');
    console.log('');
    console.log('📖 See SMTP_SETUP_GUIDE.md for troubleshooting');
    rl.close();
    return;
  }

  console.log('');

  // Step 2: Send test OTP
  const sendTest = await question('📧 Would you like to send a test OTP email? (yes/no): ');
  
  if (sendTest.toLowerCase() === 'yes' || sendTest.toLowerCase() === 'y') {
    const testEmail = await question('   Enter recipient email (or press Enter to use configured email): ');
    const recipient = testEmail.trim() || process.env.EMAIL_USER;

    console.log(`\n📤 Sending test OTP to ${recipient}...`);
    
    try {
      const result = await sendOTPEmail(recipient, '123456', 'verification');
      
      console.log('\n✅ Test OTP email sent successfully!');
      console.log('   Message ID:', result.messageId);
      if (result.previewUrl) {
        console.log('   Preview URL:', result.previewUrl);
      }
      console.log('');
      console.log('✉️  Check your inbox (and spam folder) for the test email');
      console.log('   Test OTP: 123456');
      
    } catch (error) {
      console.log('\n❌ Failed to send test email');
      console.log('   Error:', error.message);
      console.log('');
      console.log('📖 See SMTP_SETUP_GUIDE.md for troubleshooting');
    }
  }

  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║                 Test Complete                        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  rl.close();
}

// Run the test
testSMTP().catch(error => {
  console.error('\n❌ Test failed with error:', error);
  rl.close();
  process.exit(1);
});
