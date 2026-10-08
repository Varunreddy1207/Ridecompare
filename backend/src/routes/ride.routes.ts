import { Router } from 'express';
import { rideController } from '../controllers/ride.controller';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { rideCompareSchema, rideHistoryQuerySchema } from '../schemas/ride.schema';
import { compareLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

router.post(
  '/compare',
  compareLimiter,
  optionalAuth,
  validateBody(rideCompareSchema),
  rideController.compare.bind(rideController)
);

router.get(
  '/history',
  requireAuth,
  validateQuery(rideHistoryQuerySchema),
  rideController.getHistory.bind(rideController)
);

router.post(
  '/book',
  optionalAuth,
  rideController.book.bind(rideController)
);

export default router;
