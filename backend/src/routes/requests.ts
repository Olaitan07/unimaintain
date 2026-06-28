import { Router } from 'express';
import prisma from '../prisma';
import { upload } from '../middleware/upload';
import { validateBody, validateQuery, validateParams } from '../middleware/validate';
import { requireRole } from '../middleware/auth';
import { createRequestSchema, requestIdParamSchema, requestListSchema, updateStatusSchema } from '../validators/request';
import { uploadImage } from '../utils/cloudinary';
import { successResponse } from '../utils/response';

const router = Router();

router.get('/', validateQuery(requestListSchema), async (req, res, next) => {
  const { search, status, categoryId, page, limit } = req.query as any;
  const user = req.user;

  try {
    const filters: any = {};

    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      filters.status = status;
    }

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (user?.role === 'STUDENT') {
      filters.createdById = user.id;
    } else if (user?.role === 'OFFICER') {
      filters.assignedToId = user.id;
    }

    const total = await prisma.serviceRequest.count({ where: filters });
    const requests = await prisma.serviceRequest.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    });

    return res.json(successResponse({
      meta: { total, page, limit },
      items: requests
    }));
  } catch (error) {
    return next(error);
  }
});

router.post('/', upload.single('image'), validateBody(createRequestSchema), async (req, res, next) => {
  const { title, description, categoryId, priority, location } = req.body;
  const user = req.user;

  try {
    let imageUrl: string | undefined;
    if (req.file) {
      try {
        imageUrl = await uploadImage(req.file.buffer);
      } catch {
        // image upload is optional — proceed without it
      }
    }

    const request = await prisma.serviceRequest.create({
      data: {
        title,
        description,
        categoryId,
        priority: priority ?? 'MEDIUM',
        location,
        imageUrl,
        createdById: user!.id
      },
      include: {
        category: true,
        createdBy: { select: { id: true, name: true, email: true } }
      }
    });

    return res.status(201).json(successResponse(request));
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', validateParams(requestIdParamSchema), async (req, res, next) => {
  const { id } = req.params;

  try {
    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        statusLogs: { include: { changedBy: { select: { id: true, name: true, email: true } } }, orderBy: { changedAt: 'desc' } }
      }
    });

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    return res.json(successResponse(request));
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', validateParams(requestIdParamSchema), validateBody(updateStatusSchema), async (req, res, next) => {
  const { id } = req.params;
  const { status, comment } = req.body;
  const user = req.user;

  try {
    const existing = await prisma.serviceRequest.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    const allowed = (() => {
      if (user?.role === 'ADMIN') return true;
      if (user?.role === 'OFFICER') return existing.assignedToId === user.id;
      if (user?.role === 'STUDENT') return existing.createdById === user.id && status === 'COMPLETED';
      return false;
    })();

    if (!allowed) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: { status, updatedAt: new Date() }
    });

    await prisma.statusLog.create({
      data: {
        requestId: id,
        changedById: user!.id,
        oldStatus: existing.status,
        newStatus: status,
        comment
      }
    });

    return res.json(successResponse(updated));
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireRole('ADMIN'), validateParams(requestIdParamSchema), async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.serviceRequest.delete({ where: { id } });
    return res.json(successResponse(deleted));
  } catch (error) {
    return next(error);
  }
});

export default router;
