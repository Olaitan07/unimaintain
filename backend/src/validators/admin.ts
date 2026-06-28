import { z } from 'zod';

export const updateUserRoleSchema = z.object({
  role: z.enum(['STUDENT', 'STAFF', 'OFFICER', 'ADMIN'])
});

export const assignOfficerSchema = z.object({
  officerId: z.string().cuid('Officer ID must be a valid cuid')
});

export const requestIdParamSchema = z.object({
  id: z.string().cuid('Request ID must be a valid cuid')
});

export const userIdParamSchema = z.object({
  id: z.string().cuid('User ID must be a valid cuid')
});
