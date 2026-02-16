import EmployeeApplication from '../models/EmployeeApplication.js';
import User from '../models/User.js';

// @desc    Submit employee application
// @route   POST /api/applications/apply
// @access  Public
export const submitApplication = async (req, res, next) => {
  try {
    const { name, email, address1, address2, phone, position, department, experience, education, skills, portfolio, resume, coverLetter, expectedSalary, workPreference } = req.body;

    // Handle file uploads
    let resumePath = resume || '';
    let profilePhotoPath = '';

    if (req.files) {
      if (req.files.resumeFile && req.files.resumeFile[0]) {
        resumePath = `/uploads/${req.files.resumeFile[0].filename}`;
      }
      if (req.files.profilePhoto && req.files.profilePhoto[0]) {
        profilePhotoPath = `/uploads/${req.files.profilePhoto[0].filename}`;
      }
    }

    // Validation
    if (!name || !email || !address1 || !phone || !position || !department || !experience || !education || !skills || !coverLetter || !expectedSalary) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Validate expectedSalary is a valid number
    const salaryNum = Number(expectedSalary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      return res.status(400).json({ error: 'Please provide a valid expected salary' });
    }

    // Check if application already exists
    const existingApp = await EmployeeApplication.findOne({ email });
    if (existingApp && existingApp.status === 'pending') {
      return res.status(400).json({ error: 'You have already submitted an application. Please wait for review.' });
    }

    // Create application
    const application = await EmployeeApplication.create({
      name,
      email,
      address1,
      address2,
      phone,
      position,
      department,
      experience,
      education,
      skills,
      portfolio,
      resume: resumePath,
      profilePhoto: profilePhotoPath,
      coverLetter,
      expectedSalary: Number(expectedSalary),
      workPreference
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Submit position application
// @route   POST /api/applications/apply-position
// @access  Public
export const submitPositionApplication = async (req, res, next) => {
  console.log('Position application submission started');
  try {
    const { name, email, phone, education, experience, skills, portfolio, coverLetter, expectedSalary, positionId, positionTitle, department } = req.body;

    console.log('Received position application data:', { name, email, positionId, positionTitle });

    // Handle file uploads
    let resumePath = '';
    let profilePhotoPath = '';

    if (req.files) {
      if (req.files.resumeFile && req.files.resumeFile[0]) {
        resumePath = `/uploads/${req.files.resumeFile[0].filename}`;
        console.log('Resume uploaded:', resumePath);
      }
      if (req.files.profilePhoto && req.files.profilePhoto[0]) {
        profilePhotoPath = `/uploads/${req.files.profilePhoto[0].filename}`;
        console.log('Profile photo uploaded:', profilePhotoPath);
      }
    }

    // Validation
    if (!name || !email || !phone || !education || !experience || !skills || !coverLetter || !expectedSalary || !positionId || !positionTitle || !department) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Validate expectedSalary is a valid number
    const salaryNum = Number(expectedSalary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      console.log('Validation failed - invalid salary:', expectedSalary);
      return res.status(400).json({ error: 'Please provide a valid expected salary' });
    }

    // Check if application already exists for this position
    const existingApp = await EmployeeApplication.findOne({ email, positionId });
    if (existingApp && existingApp.status === 'pending') {
      console.log('Duplicate application found for position:', positionId);
      return res.status(400).json({ error: 'You have already applied for this position. Please wait for review.' });
    }

    // Create application
    const application = await EmployeeApplication.create({
      name,
      email,
      phone,
      position: positionTitle, // Use positionTitle as position
      department,
      positionId,
      positionTitle,
      experience,
      education,
      skills,
      portfolio,
      resume: resumePath,
      profilePhoto: profilePhotoPath,
      coverLetter,
      expectedSalary: Number(expectedSalary),
      workPreference: 'Full-time', // Default for position applications
      address1: 'Not provided', // Default for position applications
      address2: '' // Default for position applications
    });

    console.log('Position application created successfully:', application._id);
    res.status(201).json({
      success: true,
      message: 'Position application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Position application submission error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Admin
export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await EmployeeApplication.find().populate('reviewedBy', 'name email').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Admin
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await EmployeeApplication.findById(req.params.id).populate('reviewedBy', 'name email');
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: error.message });
  }
};

import Employee from '../models/Employee.js';

// @desc    Accept application
// @route   PUT /api/applications/:id/accept
// @access  Admin
export const acceptApplication = async (req, res, next) => {
  try {
    const { adminNotes, salary, joiningDate } = req.body;
    const userId = req.user?.id; // From auth middleware

    const application = await EmployeeApplication.findByIdAndUpdate(
      req.params.id,
      {
        status: 'accepted',
        adminNotes,
        reviewedBy: userId,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if employee already exists with this email
    const existingEmployee = await Employee.findOne({ email: application.email });
    if (existingEmployee) {
      return res.status(200).json({
        success: true,
        message: 'Application accepted successfully. Employee already exists.',
        application
      });
    }

    // Parse address from address1 and address2
    const address = {
      street: application.address1,
      city: application.address2 || '',
      state: '',
      zipCode: '',
      country: 'India'
    };

    // Create employee from application data
    const employee = await Employee.create({
      name: application.name,
      email: application.email,
      phone: application.phone,
      position: application.position,
      department: application.department,
      salary: salary || application.expectedSalary,
      joiningDate: joiningDate || new Date(),
      status: 'Active',
      skills: application.skills ? application.skills.split(',').map(skill => skill.trim()) : [],
      avatar: application.profilePhoto || '',
      address: address
    });

    res.status(200).json({
      success: true,
      message: 'Application accepted successfully and employee created',
      application,
      employee
    });
  } catch (error) {
    console.error('Accept application error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Reject application
// @route   PUT /api/applications/:id/reject
// @access  Admin
export const rejectApplication = async (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    const userId = req.user?.id; // From auth middleware

    const application = await EmployeeApplication.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        adminNotes,
        reviewedBy: userId,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      application
    });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Admin
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await EmployeeApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: error.message });
  }
};
