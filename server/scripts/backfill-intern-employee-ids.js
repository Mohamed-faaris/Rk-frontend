import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from '../models/Employee.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

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

const getSupportedDepartments = () => Object.keys(INTERN_EMPLOYEE_ID_PREFIXES);

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in environment');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const internshipEmployees = await Employee.find({
    position: 'Internship',
    department: { $in: getSupportedDepartments() }
  }).sort({ createdAt: 1, _id: 1 });

  const unsupportedInterns = await Employee.find({
    position: 'Internship',
    department: { $nin: getSupportedDepartments() }
  }).select('name department employeeId');

  if (unsupportedInterns.length > 0) {
    console.warn('Skipping internship employees with unsupported departments:');
    unsupportedInterns.forEach((employee) => {
      console.warn(`- ${employee.name || 'Unknown'} | ${employee.department || 'Unknown'} | ${employee.employeeId || '-'}`);
    });
  }

  const groupedEmployees = internshipEmployees.reduce((groups, employee) => {
    if (!groups[employee.department]) {
      groups[employee.department] = [];
    }

    groups[employee.department].push(employee);
    return groups;
  }, {});

  const departments = Object.keys(groupedEmployees).sort((a, b) => {
    return (INTERN_DEPARTMENT_SORT_ORDER[a] || 99) - (INTERN_DEPARTMENT_SORT_ORDER[b] || 99);
  });

  let updatedCount = 0;

  for (const department of departments) {
    const prefix = INTERN_EMPLOYEE_ID_PREFIXES[department];
    const employees = groupedEmployees[department];

    for (let index = 0; index < employees.length; index += 1) {
      const employee = employees[index];
      const employeeId = `${prefix}${String(index + 1).padStart(3, '0')}`;

      if (employee.employeeId !== employeeId) {
        employee.employeeId = employeeId;
        await employee.save();
        updatedCount += 1;
        console.log(`${department}: ${employee.name} -> ${employeeId}`);
      }
    }
  }

  console.log(`Backfill complete. Updated ${updatedCount} internship employee record(s).`);
};

run()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Backfill failed:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  });