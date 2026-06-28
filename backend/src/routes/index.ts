import { Router } from 'express';
import authRoutes from './auth';
import requestRoutes from './requests';
import adminRoutes from './admin';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'unimaintain-backend' } });
});

router.use('/auth', authRoutes);
router.use('/requests', authenticateJWT, requestRoutes);
router.use('/admin', authenticateJWT, requireRole('ADMIN'), adminRoutes);

export default router;
