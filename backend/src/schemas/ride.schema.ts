import { z } from 'zod';

export const locationCoordinatesSchema = z.object({
  address: z.string().min(1, 'Address is required').max(250),
  latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180')
});

export const rideCompareSchema = z.object({
  pickup: locationCoordinatesSchema,
  destination: locationCoordinatesSchema
});

export const rideHistoryQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z.string().optional().transform((val) => (val ? Math.min(50, Math.max(1, parseInt(val, 10) || 10)) : 10))
});

export type RideCompareInput = z.infer<typeof rideCompareSchema>;
export type LocationCoordinatesInput = z.infer<typeof locationCoordinatesSchema>;
