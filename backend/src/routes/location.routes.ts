import { Router } from 'express';
import { locationController } from '../controllers/location.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { locationSearchQuerySchema, savedLocationCreateSchema } from '../schemas/location.schema';

const router = Router();

router.get(
  '/search',
  validateQuery(locationSearchQuerySchema),
  locationController.search.bind(locationController)
);

router.get(
  '/saved',
  requireAuth,
  locationController.getSaved.bind(locationController)
);

router.post(
  '/saved',
  requireAuth,
  validateBody(savedLocationCreateSchema),
  locationController.createSaved.bind(locationController)
);

router.delete(
  '/saved/:id',
  requireAuth,
  locationController.deleteSaved.bind(locationController)
);

export default router;
