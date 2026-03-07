#!/usr/bin/env node

/**
 * Pre-Deployment Checklist for Vercel
 * Run this before deploying to verify OTP email configuration
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║     🚀 Vercel Deployment Checklist - OTP Email       ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

let allGood = true;

// Check 1: .env file exists locally
console.log('1️⃣  Checking local .env file...');
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file exists\n');
} else {
  console.log('   ⚠️  .env file not found (OK for Vercel, but needed for local testing)\n');
}

// Check 2: Environment variables are set
console.log('2️⃣  Checking environment variables...');
const requiredVars = {
  'EMAIL_SERVICE': process.env.EMAIL_SERVICE,
  'EMAIL_USER': process.env.EMAIL_USER,
  'EMAIL_PASSWORD': process.env.EMAIL_PASSWORD,
  'EMAIL_FROM': process.env.EMAIL_FROM
};

let localEnvComplete = true;
for (const [key, value] of Object.entries(requiredVars)) {
  if (!value || value === 'your-app-password-here') {
    console.log(`   ❌ ${key}: Not set`);
    localEnvComplete = false;
    allGood = false;
  } else {
    console.log(`   ✅ ${key}: ${key === 'EMAIL_PASSWORD' ? '****' + value.slice(-4) : value}`);
  }
}

if (localEnvComplete) {
  console.log('   ✅ All variables set locally\n');
} else {
  console.log('   ⚠️  Some variables missing (needed for local dev)\n');
}

// Check 3: No hardcoded credentials in code
console.log('3️⃣  Checking for hardcoded credentials...');
const emailServicePath = path.join(__dirname, '../server/utils/emailService.js');
const emailServiceContent = fs.readFileSync(emailServicePath, 'utf-8');

const dangerousPatterns = [
  /EMAIL_PASSWORD !== ['"]xgkm/i,
  /rajkayal7281@gmail\.com/i,
];

let hasHardcodedCreds = false;
for (const pattern of dangerousPatterns) {
  if (pattern.test(emailServiceContent)) {
    console.log(`   ⚠️  Found hardcoded credential pattern`);
    hasHardcodedCreds = true;
  }
}

if (hasHardcodedCreds) {
  console.log('   ❌ Security issue: Credentials in source code\n');
  allGood = false;
} else {
  console.log('   ✅ No hardcoded credentials found\n');
}

// Check 4: .env in .gitignore
console.log('4️⃣  Checking .gitignore...');
const gitignorePath = path.join(__dirname, '../.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  if (gitignoreContent.includes('.env')) {
    console.log('   ✅ .env is in .gitignore\n');
  } else {
    console.log('   ❌ .env NOT in .gitignore - SECURITY RISK!\n');
    allGood = false;
  }
} else {
  console.log('   ⚠️  No .gitignore file found\n');
}

// Check 5: Dependencies installed
console.log('5️⃣  Checking dependencies...');
const serverNodeModules = path.join(__dirname, '../server/node_modules');
if (fs.existsSync(serverNodeModules)) {
  console.log('   ✅ Server dependencies installed\n');
} else {
  console.log('   ❌ Server dependencies not installed (run: cd server && npm install)\n');
  allGood = false;
}

// Summary
console.log('═══════════════════════════════════════════════════════\n');
console.log('📋 NEXT STEPS FOR VERCEL DEPLOYMENT:\n');

console.log('1. Add Environment Variables in Vercel Dashboard:');
console.log('   → Go to: https://vercel.com/dashboard');
console.log('   → Settings → Environment Variables');
console.log('   → Add these variables:\n');

console.log('   EMAIL_SERVICE = gmail');
console.log('   EMAIL_USER = rajkayal7281@gmail.com');
console.log('   EMAIL_PASSWORD = xgkmtezivaertolf');
console.log('   EMAIL_FROM = "RajKayal Creative Hub <noreply@rkch.tech>"\n');

console.log('2. Make sure to select ALL environments:');
console.log('   ☑ Production');
console.log('   ☑ Preview');
console.log('   ☑ Development\n');

console.log('3. After adding variables, REDEPLOY:');
console.log('   → Deployments → Latest → Redeploy');
console.log('   → Or: git push (triggers auto-deploy)\n');

console.log('4. Verify in Vercel Function Logs:');
console.log('   → Look for: "📧 Using Gmail SMTP for sending OTP emails"\n');

console.log('📖 Detailed guide: VERCEL_SETUP.md\n');

if (allGood) {
  console.log('✅ Local setup looks good! Ready to configure Vercel.\n');
} else {
  console.log('⚠️  Some issues found. Fix them before deploying.\n');
}

console.log('═══════════════════════════════════════════════════════\n');
