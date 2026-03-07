#!/usr/bin/env node

/**
 * Verify Vercel Environment Variables
 * This script helps check if your Vercel deployment has the required email variables
 */

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║   🔍 Vercel Environment Variables Status Check      ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

console.log('📋 Quick Checklist:\n');

console.log('✅ Step 1: Go to Vercel Dashboard');
console.log('   URL: https://vercel.com/dashboard\n');

console.log('✅ Step 2: Select your project: Rk-frontend\n');

console.log('✅ Step 3: Go to Settings → Environment Variables\n');

console.log('✅ Step 4: Verify these 4 variables exist:\n');

const requiredVars = [
  { name: 'EMAIL_SERVICE', value: 'gmail', required: true },
  { name: 'EMAIL_USER', value: 'rajkayal7281@gmail.com', required: true },
  { name: 'EMAIL_PASSWORD', value: 'xgkmtezivaertolf (NO SPACES!)', required: true },
  { name: 'EMAIL_FROM', value: '"RajKayal Creative Hub <noreply@rkch.tech>"', required: true }
];

requiredVars.forEach((v, i) => {
  console.log(`   ${i + 1}. ${v.name}`);
  console.log(`      Value: ${v.value}`);
  console.log(`      Environments: ✅ Production ✅ Preview ✅ Development\n`);
});

console.log('═══════════════════════════════════════════════════════\n');

console.log('🔴 IMPORTANT CHANGES:\n');
console.log('   • Code updated to PREVENT silent failures');
console.log('   • Production will now BLOCK emails if variables missing');
console.log('   • You will see clear error: "Email service not configured"\n');

console.log('📝 After Adding Variables:\n');
console.log('   1. Click "Redeploy" in Vercel Deployments tab');
console.log('   2. Wait for deployment to complete');
console.log('   3. Test OTP from your website');
console.log('   4. Check Runtime Logs for: "📧 Using Gmail SMTP"\n');

console.log('🧪 How to Test:\n');
console.log('   1. Go to your deployed website');
console.log('   2. Try to send an OTP');
console.log('   3. Check your email inbox\n');

console.log('❌ If Still Failing:\n');
console.log('   • Go to Vercel → Deployments → Latest → Functions');
console.log('   • Look at Runtime Logs for /api/otp/send');
console.log('   • Look for error messages\n');

console.log('🔗 Quick Links:\n');
console.log('   Vercel Dashboard: https://vercel.com/dashboard');
console.log('   Gmail App Passwords: https://myaccount.google.com/apppasswords\n');

console.log('═══════════════════════════════════════════════════════\n');

console.log('💡 Pro Tip:\n');
console.log('   After adding variables, you MUST redeploy.');
console.log('   Environment variables only apply to NEW deployments!\n');

console.log('═══════════════════════════════════════════════════════\n');
