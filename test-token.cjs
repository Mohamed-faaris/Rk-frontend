const axios = require('axios');

async function testToken() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTMwZWVlMTI1ODA0ZjQxY2NlYjJiNiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NDA2NzQyNywiZXhwIjoxNzY0NjcyMjI3fQ.kpPrH5GQuuA1mF0XFEdOEZiYrXT1WrXZoAxEpaFZTao';

  console.log('Testing applications endpoint with correct token...');

  try {
    const response = await axios.get('http://localhost:5002/api/applications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', response.data);
  } catch (err) {
    console.log('Error:', err.response?.status, err.response?.data);
  }
}

testToken();