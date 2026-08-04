import Employee from '../models/Employee.js';
import EmployeeApplication from '../models/EmployeeApplication.js';
import { sendApplicationAcceptedEmail } from '../utils/emailService.js';

const INTERN_EMPLOYEE_ID_PREFIXES = {
  Development: 'IDV',
  Design: 'IDS',
  '3D Animation': 'IDA',
  'UI/UX': 'IUX',
  Management: 'IMA',
  Marketing: 'IMK',
  Sales: 'ISA',
  HR: 'IHR',
  Operations: 'IOP'
};

const INTERN_DEPARTMENT_SORT_ORDER = {
  Development: 1,
  Design: 2,
  '3D Animation': 3,
  'UI/UX': 4,
  Management: 5,
  Marketing: 6,
  Sales: 7,
  HR: 8,
  Operations: 9
};

const isInternshipEmployee = (employee) => employee?.position === 'Internship';

const getInternEmployeeIdPrefix = (department) => INTERN_EMPLOYEE_ID_PREFIXES[department] || '';

const isValidInternEmployeeId = (employeeId, prefix) => {
  if (!employeeId || !prefix) {
    return false;
  }

  return employeeId.startsWith(prefix) && /^\d{3}$/.test(employeeId.slice(prefix.length));
};

const generateNextInternEmployeeId = async (department, excludeEmployeeId = null) => {
  const prefix = getInternEmployeeIdPrefix(department);

  if (!prefix) {
    throw new Error(`Internship employees must belong to a supported department. Supported departments are: ${Object.keys(INTERN_EMPLOYEE_ID_PREFIXES).join(', ')}`);
  }

  const query = {
    position: 'Internship',
    department,
    employeeId: new RegExp(`^${prefix}\\d{3}$`)
  };

  if (excludeEmployeeId) {
    query._id = { $ne: excludeEmployeeId };
  }

  const latestIntern = await Employee.findOne(query)
    .sort({ employeeId: -1 })
    .select('employeeId');

  const latestNumber = latestIntern?.employeeId
    ? Number(latestIntern.employeeId.slice(prefix.length))
    : 0;

  return `${prefix}${String(latestNumber + 1).padStart(3, '0')}`;
};

const ensureInternEmployeeId = async (employeeData, excludeEmployeeId = null) => {
  if (!isInternshipEmployee(employeeData)) {
    return employeeData;
  }

  const prefix = getInternEmployeeIdPrefix(employeeData.department);

  if (!prefix) {
    throw new Error(`Internship employees must belong to a supported department. Supported departments are: ${Object.keys(INTERN_EMPLOYEE_ID_PREFIXES).join(', ')}`);
  }

  if (isValidInternEmployeeId(employeeData.employeeId, prefix)) {
    return employeeData;
  }

  employeeData.employeeId = await generateNextInternEmployeeId(employeeData.department, excludeEmployeeId);
  return employeeData;
};

const sortEmployeesForDisplay = (employees = []) => {
  return [...employees].sort((a, b) => {
    const aIntern = isInternshipEmployee(a);
    const bIntern = isInternshipEmployee(b);

    if (aIntern && bIntern) {
      const departmentDiff = (INTERN_DEPARTMENT_SORT_ORDER[a.department] || 99) - (INTERN_DEPARTMENT_SORT_ORDER[b.department] || 99);

      if (departmentDiff !== 0) {
        return departmentDiff;
      }

      return (a.employeeId || '').localeCompare(b.employeeId || '', undefined, { numeric: true, sensitivity: 'base' });
    }

    if (aIntern !== bIntern) {
      return aIntern ? -1 : 1;
    }

    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
export const getEmployees = async (req, res) => {
  try {
    const { status, department, position } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (position) filter.position = position;

    const employees = await Employee.find(filter)
      .populate('projects')
      .sort({ createdAt: -1 });

    const sortedEmployees = sortEmployeesForDisplay(employees);

    res.status(200).json({
      success: true,
      count: sortedEmployees.length,
      data: sortedEmployees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private/Admin
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('projects');

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create employee from application
// @route   POST /api/employees/from-application/:applicationId
// @access  Private/Admin
export const createEmployeeFromApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { salary, joiningDate } = req.body;

    // Find the application
    const application = await EmployeeApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if employee already exists with this email
    const existingEmployee = await Employee.findOne({ email: application.email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this email already exists' });
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
    const employeeData = await ensureInternEmployeeId({
      name: application.name,
      email: application.email,
      phone: application.phone,
      position: application.position,
      department: application.department,
      salary: salary || application.expectedSalary,
      joiningDate: joiningDate || new Date(),
      status: 'Active',
      skills: application.skills ? application.skills.split(',').map(skill => skill.trim()) : [],
      address: address
    });

    const employee = await Employee.create(employeeData);

    // Update application status to accepted
    await EmployeeApplication.findByIdAndUpdate(applicationId, {
      status: 'accepted',
      reviewedBy: req.user?.id,
      updatedAt: new Date()
    });

    // Notify only the applicant linked to this application
    if (application.email) {
      await sendApplicationAcceptedEmail(
        application.email,
        application.name,
        application.position,
        application.department,
        salary || application.expectedSalary,
        joiningDate,
        undefined
      );
    }

    res.status(201).json({
      success: true,
      message: 'Employee created successfully from application',
      data: employee
    });
  } catch (error) {
    console.error('Create employee from application error:', error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = async (req, res) => {
  try {
    const employeeData = await ensureInternEmployeeId({ ...req.body });
    const employee = await Employee.create(employeeData);

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    Object.assign(employee, req.body);

    if (isInternshipEmployee(employee)) {
      await ensureInternEmployeeId(employee, employee._id);
    }

    await employee.save();

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get employee statistics
// @route   GET /api/employees/stats
// @access  Private/Admin
export const getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const onLeave = await Employee.countDocuments({ status: 'On Leave' });
    
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    const positionStats = await Employee.aggregate([
      {
        $group: {
          _id: '$position',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        onLeave,
        departmentStats,
        positionStats
      }
    });
  } catch (error) {
    console.error('Get employee stats error:', error);
    res.status(500).json({ error: error.message });
  }
};
