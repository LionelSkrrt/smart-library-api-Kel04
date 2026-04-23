import express from 'express';
import { ReportController } from '../controllers/reportController.js';

const router = express.Router();

/**
 * Endpoint untuk mendapatkan ringkasan statistik koleksi perpustakaan
 * URL: GET /api/reports/stats
 */
router.get('/stats', ReportController.getLibraryStats);

export default router;