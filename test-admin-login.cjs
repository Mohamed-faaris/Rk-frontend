const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    const loginResponse = await axios.post('http://localhost:5002/api/auth/login', {
      email: 'rajkayal7281@gmail.com',
      password: 'rajkayal2025'
    });
    console.log('Login response:', loginResponse.data);

    if (loginResponse.data.requiresOTP) {
      console.log('OTP required. This is expected for admin login.');
      return;
    }

    const token = loginResponse.data.token;
    console.log('Got token, testing applications endpoint...');

    const appsResponse = await axios.get('http://localhost:5002/api/applications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Applications response:', appsResponse.data);

  } catch (err) {
    console.log('Error:', err.response?.status, err.response?.data);
  }
}

testAdminLogin();