import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/response';
import { UnauthorizedError } from '../utils/errors';

export class NotificationController {
  public async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const notifications = await notificationService.getNotifications(req.user.userId);
      sendSuccess(res, notifications, 200);
    } catch (error) {
      next(error);
    }
  }

  public async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const { id } = req.params;
      const updated = await notificationService.markAsRead(req.user.userId, id);
      sendSuccess(res, updated, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
