import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get(
  '/',
  requireAuth,
  notificationController.getNotifications.bind(notificationController)
);

router.patch(
  '/:id/read',
  requireAuth,
  notificationController.markAsRead.bind(notificationController)
);

export default router;
