import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required')
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const createRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  location: z.string().min(1, 'Location is required')
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
