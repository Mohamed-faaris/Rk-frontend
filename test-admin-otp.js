import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

async function testAdminOTPFlow() {
  try {
    console.log('\n═══════════════════════════════════════');
    console.log('   Testing Admin OTP Login Flow');
    console.log('═══════════════════════════════════════\n');
    
    // Step 1: Login as admin (should trigger OTP)
    // Assuming rajkayal7281@gmail.com is an admin user
    // If not, this test might fail or skip OTP
    const email = 'rajkayal7281@gmail.com';
    const password = 'rajkayal2025'; // Admin password found in setup-admin.js

    console.log(`Step 1: Logging in as admin (${email})...`);
    
    let loginResponse;
    try {
        loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        return;
    }
    
    console.log('Login Response:', {
      success: loginResponse.data.success,
      requiresOTP: loginResponse.data.requiresOTP,
      message: loginResponse.data.message
    });

    if (loginResponse.data.requiresOTP) {
        console.log('\n✅ OTP Triggered Successfully!');
        
        if (loginResponse.data.previewUrl) {
             console.log('📧 Email Preview URL:', loginResponse.data.previewUrl);
        }

        // Prompt for manual OTP entry if running interactively
        // Since we can't easily get the OTP programmatically (unless we read logs/db)
        // We will stop here.
        console.log('\nTo complete the test, you would now call the login endpoint AGAIN with the otp field.');
        
        /*
        const otp = '123456'; // Manually enter OTP from email/console
        const verifyResponse = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
            otp
        });
        console.log('OTP Verify Response:', verifyResponse.data);
        */

    } else {
        console.log('\nℹ️ Login succeeded without OTP. User might not be admin or SKIP_OTP is true.');
    }

  } catch (error) {
    console.error('Test Error:', error.response ? error.response.data : error.message);
  }
}

testAdminOTPFlow();
