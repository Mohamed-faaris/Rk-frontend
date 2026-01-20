import express from 'express';
import { getPublicConfig } from '../controllers/configController.js';

const router = express.Router();

router.get('/public', getPublicConfig);

export default router;
