import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createDNS,
  getAllDNS,
  getDNSByDomain,
  updateDNS,
  addDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
  deleteDNS,
  checkDomainStatus,
  getExpiringDomains,
  getDomainHealthReport
} from '../controllers/dnsController.js';

const router = express.Router();

// Public routes
router.get('/health-report', getDomainHealthReport);
router.get('/expiring', getExpiringDomains);
router.get('/domain/:domain', getDNSByDomain);

// Protected routes (require authentication)
router.post('/', protect, createDNS);
router.get('/', protect, getAllDNS);
router.patch('/:id', protect, updateDNS);
router.delete('/:id', protect, deleteDNS);

// DNS Record management
router.post('/:id/records', protect, addDNSRecord);
router.patch('/:id/records/:recordId', protect, updateDNSRecord);
router.delete('/:id/records/:recordId', protect, deleteDNSRecord);

// Status check
router.post('/:id/check-status', protect, checkDomainStatus);

export default router;
