import { z } from 'zod';

export const savedLocationCreateSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(60),
  address: z.string().min(1, 'Address is required').max(250),
  latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180')
});

export const locationSearchQuerySchema = z.object({
  q: z.string().optional().default('')
});

export type SavedLocationCreateInput = z.infer<typeof savedLocationCreateSchema>;
