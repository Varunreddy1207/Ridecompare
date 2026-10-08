import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { updateProfileSchema } from '../schemas/user.schema';

const router = Router();

router.get(
  '/profile',
  requireAuth,
  userController.getProfile.bind(userController)
);

router.patch(
  '/profile',
  requireAuth,
  validateBody(updateProfileSchema),
  userController.updateProfile.bind(userController)
);

router.delete(
  '/profile',
  requireAuth,
  userController.deleteAccount.bind(userController)
);

router.delete(
  '/account',
  requireAuth,
  userController.deleteAccount.bind(userController)
);

export default router;
