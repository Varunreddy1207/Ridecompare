import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { authLimiter } from '../middleware/rate-limit.middleware';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  authController.register.bind(authController)
);

router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  authController.login.bind(authController)
);

router.get(
  '/me',
  requireAuth,
  authController.me.bind(authController)
);

router.post(
  '/logout',
  optionalAuth,
  authController.logout.bind(authController)
);

export default router;
