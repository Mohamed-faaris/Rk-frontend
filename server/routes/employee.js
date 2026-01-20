import express from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  createEmployeeFromApplication,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} from '../controllers/employeeController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin access
router.use(protect);
router.use(admin);

// Stats route must come before :id route
router.get('/stats', getEmployeeStats);

// Create employee from application
router.post('/from-application/:applicationId', createEmployeeFromApplication);

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
