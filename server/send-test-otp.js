// Send Test OTP - Quick Test
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendOTPEmail } from './utils/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment
dotenv.config({ path: path.join(__dirname, '../.env') });

async function sendTestOTP() {
  console.log('\n📧 Sending Test OTP Email...\n');
  
  const testEmail = process.argv[2] || process.env.EMAIL_USER;
  const testOTP = '123456';
  
  console.log('   To:', testEmail);
  console.log('   OTP:', testOTP);
  console.log('');
  
  try {
    const result = await sendOTPEmail(testEmail, testOTP, 'verification');
    
    console.log('\n✅ SUCCESS! Test OTP email sent!\n');
    console.log('   Message ID:', result.messageId);
    console.log('');
    console.log('📬 Check your inbox:', testEmail);
    console.log('   (Also check spam/junk folder)');
    console.log('');
    
  } catch (error) {
    console.log('\n❌ FAILED to send email\n');
    console.log('   Error:', error.message);
    console.log('');
    console.log('   Troubleshooting:');
    console.log('   • Verify App Password is correct');
    console.log('   • Ensure 2FA is enabled on Gmail');
    console.log('   • Check if email address is correct');
    console.log('   • Try regenerating the App Password');
    console.log('');
    process.exit(1);
  }
}

sendTestOTP();
