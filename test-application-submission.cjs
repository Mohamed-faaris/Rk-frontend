const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testApplicationSubmission() {
  console.log('Testing application submission...');

  const timestamp = Date.now();

  try {
    // Test general employee application
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', `test${timestamp}@example.com`);
    formData.append('address1', '123 Test St');
    formData.append('phone', '1234567890');
    formData.append('position', 'Developer');
    formData.append('department', 'Development');
    formData.append('experience', '1-3 years');
    formData.append('education', 'Bachelor Degree');
    formData.append('skills', 'JavaScript, React');
    formData.append('coverLetter', 'Test application');
    formData.append('expectedSalary', '50000');

    const response = await axios.post('http://localhost:5002/api/applications/apply', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('✅ General application submitted successfully:', response.data);

    // Test position application
    const positionFormData = new FormData();
    positionFormData.append('name', 'Position Test');
    positionFormData.append('email', `position${timestamp}@example.com`);
    positionFormData.append('phone', '0987654321');
    positionFormData.append('education', 'Master Degree');
    positionFormData.append('experience', '3-5 years');
    positionFormData.append('skills', 'Figma, Adobe XD');
    positionFormData.append('coverLetter', 'Position test application');
    positionFormData.append('expectedSalary', '60000');
    positionFormData.append('positionId', 'pos123');
    positionFormData.append('positionTitle', 'UI/UX Designer');
    positionFormData.append('department', 'Design');

    const positionResponse = await axios.post('http://localhost:5002/api/applications/apply-position', positionFormData, {
      headers: {
        ...positionFormData.getHeaders()
      }
    });

    console.log('✅ Position application submitted successfully:', positionResponse.data);

    // Test getting all applications (admin endpoint)
    const getResponse = await axios.get('http://localhost:5002/api/applications');
    console.log('✅ Retrieved applications:', getResponse.data.length, 'applications found');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
}

testApplicationSubmission();