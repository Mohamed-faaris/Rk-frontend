# 🚀 Vercel Deployment - OTP Email Configuration

## 🔴 CRITICAL: Security Issue Fixed

**Your Gmail credentials were hardcoded in the source code!** This has been removed for security.

## 📋 Setup Environment Variables in Vercel

Your OTP emails aren't working on Vercel because **environment variables are not configured**. Follow these steps:

### Step 1: Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `Rk-frontend`
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add Email Configuration Variables

Add these **4 environment variables** one by one:

#### 1. EMAIL_SERVICE
```
Key: EMAIL_SERVICE
Value: gmail
Environment: Production, Preview, Development (select all)
```

#### 2. EMAIL_USER
```
Key: EMAIL_USER
Value: rajkayal7281@gmail.com
Environment: Production, Preview, Development (select all)
```

#### 3. EMAIL_PASSWORD
```
Key: EMAIL_PASSWORD
Value: xgkmtezivaertolf
Environment: Production, Preview, Development (select all)
```

#### 4. EMAIL_FROM
```
Key: EMAIL_FROM
Value: "RajKayal Creative Hub <noreply@rkch.tech>"
Environment: Production, Preview, Development (select all)
```

### Step 3: Redeploy Your Application

After adding the environment variables:

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**

**Option B: Via Git Push**
```bash
git add .
git commit -m "Configure SMTP for Vercel"
git push origin main
```

Vercel will automatically redeploy with the new environment variables.

### Step 4: Verify Deployment

After redeployment:

1. **Check Logs**: Go to Deployments → Your deployment → **Runtime Logs**
2. Look for: `📧 Using Gmail SMTP for sending OTP emails`
3. **Test OTP**: Try sending an OTP from your production site

## 🔍 Verify Environment Variables Are Set

You can verify in the **Runtime Logs** during the next deployment:

```
✅ Should see: 📧 Using Gmail SMTP for sending OTP emails
❌ If you see: ⚠️ Gmail SMTP not configured
   → Environment variables are not set correctly
```

## 📸 Visual Guide

### Adding Environment Variable in Vercel:

```
Settings → Environment Variables → Add New

┌─────────────────────────────────────────┐
│ Key:   EMAIL_SERVICE                    │
│ Value: gmail                            │
│                                         │
│ ☑ Production                            │
│ ☑ Preview                               │
│ ☑ Development                           │
│                                         │
│        [Save]                           │
└─────────────────────────────────────────┘
```

Repeat for all 4 variables: `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`

## 🧪 Test After Deployment

### Test via API Endpoint:
```bash
curl -X POST https://your-domain.vercel.app/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","purpose":"verification"}'
```

### Expected Response:
```json
{
  "success": true,
  "message": "OTP has been sent to your email",
  "expiresIn": 300
}
```

## 🔒 Security Best Practices

✅ **Done:**
- Removed hardcoded credentials from source code
- Using environment variables

⚠️ **Important:**
- Never commit `.env` file to Git
- Keep your App Password secure
- Rotate passwords regularly
- Use Vercel's encrypted environment variables

## 🐛 Troubleshooting

### Issue: Still seeing "Gmail SMTP not configured" in logs

**Solution:**
1. Double-check all 4 environment variables are added
2. Make sure you selected **Production** environment
3. **Redeploy** after adding variables (important!)
4. Variables only take effect on new deployments

### Issue: "Invalid login" or "Authentication failed"

**Possible causes:**
- App Password is incorrect (regenerate it)
- 2FA not enabled on Gmail
- Using regular password instead of App Password
- Extra spaces in the password value

### Issue: Emails not received

**Check:**
1. Vercel Function Logs for errors
2. Gmail "Sent" folder to confirm email was sent
3. Recipient's spam/junk folder
4. Gmail daily sending limits (500 emails/day)

## 📊 Monitoring

### Check Vercel Function Logs:
1. Go to your project dashboard
2. **Deployments** → Latest deployment
3. Click **Functions** → `/api/otp/send`
4. View logs for each invocation

Look for:
```
📧 Using Gmail SMTP for sending OTP emails
✉️  OTP Email sent successfully via SMTP!
Message ID: <...>
Response: 250 2.0.0 OK ...
```

## 🎯 Quick Checklist

Before asking for help, verify:

- [ ] Added `EMAIL_SERVICE=gmail` to Vercel
- [ ] Added `EMAIL_USER=rajkayal7281@gmail.com` to Vercel
- [ ] Added `EMAIL_PASSWORD=xgkmtezivaertolf` to Vercel (without spaces)
- [ ] Added `EMAIL_FROM` to Vercel
- [ ] Selected **Production** environment for all variables
- [ ] **Redeployed** the application after adding variables
- [ ] Checked Runtime Logs for "Using Gmail SMTP"
- [ ] 2FA is enabled on Gmail
- [ ] App Password is valid (not regular password)

## 🚀 Alternative: Vercel CLI

You can also set environment variables via CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variables
vercel env add EMAIL_SERVICE production
# Enter: gmail

vercel env add EMAIL_USER production
# Enter: rajkayal7281@gmail.com

vercel env add EMAIL_PASSWORD production
# Enter: xgkmtezivaertolf

vercel env add EMAIL_FROM production
# Enter: "RajKayal Creative Hub <noreply@rkch.tech>"

# Redeploy
vercel --prod
```

## 📚 Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [Vercel Function Logs](https://vercel.com/docs/observability/runtime-logs)

---

**After following this guide, your OTP emails will work on Vercel! 🎉**

If you still face issues, check the Vercel Function Logs for detailed error messages.
