import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().regex(/^[+0-9\s-]{8,20}$/, 'Invalid phone number format').optional().nullable(),
  avatarUrl: z.string().max(300).optional().nullable()
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
