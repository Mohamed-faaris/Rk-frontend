// Quick SMTP Diagnostic Tool
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('\n🔍 SMTP Configuration Diagnostics\n');
console.log('='.repeat(50));

// Check environment variables
console.log('\n📋 Environment Check:');
console.log('   EMAIL_SERVICE:', process.env.EMAIL_SERVICE || '❌ NOT SET');
console.log('   EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ SET' : '❌ NOT SET');

if (process.env.EMAIL_PASSWORD) {
  const pwd = process.env.EMAIL_PASSWORD;
  console.log('   Password Length:', pwd.length);
  console.log('   Has Spaces:', pwd.includes(' ') ? '⚠️ YES (REMOVE THEM!)' : '✅ NO');
  console.log('   Password Preview:', pwd.substring(0, 4) + '****' + pwd.substring(pwd.length - 4));
}

console.log('\n📝 Common Issues:');
console.log('   1. App password has spaces - REMOVE ALL SPACES');
console.log('   2. Using regular Gmail password - USE APP PASSWORD');
console.log('   3. 2FA not enabled - ENABLE IT FIRST');
console.log('   4. Wrong email address');

console.log('\n🔧 Next Steps:');
if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'your-app-password-here') {
  console.log('   ❌ Configure EMAIL_PASSWORD in .env file');
  console.log('   📖 Visit: https://myaccount.google.com/apppasswords');
} else if (process.env.EMAIL_PASSWORD.includes(' ')) {
  console.log('   ⚠️  REMOVE SPACES from EMAIL_PASSWORD!');
  console.log('   Current:', process.env.EMAIL_PASSWORD);
  console.log('   Should be:', process.env.EMAIL_PASSWORD.replace(/\s/g, ''));
} else {
  console.log('   ✅ Configuration looks good! Testing connection...\n');
  
  // Test actual connection
  import('./utils/emailService.js').then(async ({ verifyEmailConnection }) => {
    const result = await verifyEmailConnection();
    if (result.success) {
      console.log('   ✅ SMTP Connection Successful!\n');
    } else {
      console.log('   ❌ Connection Failed:', result.error);
      console.log('\n   Troubleshooting:');
      console.log('   • Regenerate App Password');
      console.log('   • Check if 2FA is enabled');
      console.log('   • Verify email address is correct');
      console.log('   • Try different network (if on VPN/firewall)\n');
    }
  }).catch(err => {
    console.error('   ❌ Error:', err.message);
  });
}

console.log('\n' + '='.repeat(50) + '\n');
