import { z } from 'zod';

export const createRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().cuid('Category ID must be a valid cuid'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  location: z.string().min(1, 'Location is required')
});

export const requestListSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED']).optional(),
  categoryId: z.string().cuid('Category ID must be a valid cuid').optional(),
  page: z.preprocess((value) => Number(value), z.number().int().positive().default(1)),
  limit: z.preprocess((value) => Number(value), z.number().int().positive().max(100).default(20))
});

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED']),
  comment: z.string().optional()
});

export const requestIdParamSchema = z.object({
  id: z.string().cuid('Request ID must be a valid cuid')
});
