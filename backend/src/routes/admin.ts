import { Router } from 'express';
import prisma from '../prisma';
import { validateBody, validateParams } from '../middleware/validate';
import { assignOfficerSchema, requestIdParamSchema, updateUserRoleSchema, userIdParamSchema } from '../validators/admin';
import { successResponse } from '../utils/response';

const router = Router();

router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    return res.json(successResponse(users));
  } catch (error) {
    return next(error);
  }
});

router.patch('/users/:id', validateParams(userIdParamSchema), validateBody(updateUserRoleSchema), async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });
    return res.json(successResponse(user));
  } catch (error) {
    return next(error);
  }
});

router.post('/requests/:id/assign', validateParams(requestIdParamSchema), validateBody(assignOfficerSchema), async (req, res, next) => {
  const { id } = req.params;
  const { officerId } = req.body;

  try {
    const officer = await prisma.user.findUnique({ where: { id: officerId } });
    if (!officer || officer.role !== 'OFFICER') {
      return res.status(400).json({ success: false, error: 'Officer not found or invalid role' });
    }

    const request = await prisma.serviceRequest.update({
      where: { id },
      data: {
        assignedToId: officerId,
        status: 'ASSIGNED'
      },
      include: {
        category: true,
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    });

    await prisma.assignment.create({
      data: {
        requestId: id,
        officerId,
        notes: `Assigned by ${req.user?.id}`
      }
    });

    return res.json(successResponse(request));
  } catch (error) {
    return next(error);
  }
});

router.get('/reports', async (req, res, next) => {
  try {
    const statusCounts = await prisma.serviceRequest.groupBy({
      by: ['status'],
      _count: { _all: true }
    });

    const categoryCounts = await prisma.serviceRequest.groupBy({
      by: ['categoryId'],
      _count: { _all: true }
    });

    const categories = await prisma.category.findMany();
    const categoryReport = categoryCounts.map((count: { categoryId: string; _count: { _all: number } }) => ({
      categoryId: count.categoryId,
      count: count._count._all,
      name: categories.find((category) => category.id === count.categoryId)?.name ?? 'Unknown'
    }));

    const officerCounts = await prisma.serviceRequest.groupBy({
      by: ['assignedToId'],
      where: { assignedToId: { not: null } },
      _count: { _all: true }
    });

    const officers = await prisma.user.findMany({ where: { role: 'OFFICER' } });
    const officerReport = officerCounts.map((count) => ({
      officerId: count.assignedToId ?? 'unknown',
      count: count._count._all,
      name: officers.find((officer) => officer.id === count.assignedToId)?.name ?? 'Unknown'
    }));

    return res.json(successResponse({
      status: statusCounts.map((item: { status: string; _count: { _all: number } }) => ({ status: item.status, count: item._count._all })),
      category: categoryReport,
      officer: officerReport
    }));
  } catch (error) {
    return next(error);
  }
});

export default router;
