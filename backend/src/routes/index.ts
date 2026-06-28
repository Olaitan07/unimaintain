import { Router } from 'express';
import authRoutes from './auth';
import requestRoutes from './requests';
import adminRoutes from './admin';
import { authenticateJWT, requireRole } from '../middleware/auth';
import prisma from '../prisma';
import { successResponse } from '../utils/response';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'unimaintain-backend' } });
});

router.get('/categories', authenticateJWT, async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return res.json(successResponse(categories));
  } catch (error) {
    return next(error);
  }
});

router.use('/auth', authRoutes);
router.use('/requests', authenticateJWT, requestRoutes);
router.use('/admin', authenticateJWT, requireRole('ADMIN'), adminRoutes);

export default router;
