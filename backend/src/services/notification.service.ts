import { randomUUID } from 'crypto';
import { prisma, isDatabaseConnected } from '../config/database';
import { NotFoundError } from '../utils/errors';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export class NotificationService {
  // In-memory fallback store
  private memoryNotifications: Map<string, NotificationItem[]> = new Map();

  constructor() {
    this.seedDefaultNotifications();
  }

  private seedDefaultNotifications(): void {
    const demoUserId = 'demo-user-1';
    const sampleNotifications: NotificationItem[] = [
      {
        id: 'notif-1',
        userId: demoUserId,
        title: 'Price Drop Alert',
        message: 'Rapido Bike prices are down 15% in your area today.',
        type: 'PRICE_DROP',
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'notif-2',
        userId: demoUserId,
        title: 'Welcome to VOZX RideCompare',
        message: 'Compare prices between Rapido, Ola, and Uber to save on every ride.',
        type: 'WELCOME',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'notif-3',
        userId: demoUserId,
        title: 'Ride Completed',
        message: 'Your ride with Rapido to Sanjay Ghodawat University was completed.',
        type: 'RIDE_UPDATE',
        isRead: true,
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      }
    ];

    this.memoryNotifications.set(demoUserId, sampleNotifications);
  }

  /**
   * Get all notifications for user
   */
  public async getNotifications(userId: string): Promise<NotificationItem[]> {
    if (isDatabaseConnected) {
      try {
        const notifications = await prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });

        return notifications.map((n) => ({
          id: n.id,
          userId: n.userId,
          title: n.title,
          message: n.message,
          type: 'INFO',
          isRead: n.isRead,
          createdAt: n.createdAt.toISOString()
        }));
      } catch (err) {
        // Fall back to memory
      }
    }

    return this.memoryNotifications.get(userId) || this.memoryNotifications.get('demo-user-1') || [];
  }

  /**
   * Mark a notification as read
   */
  public async markAsRead(userId: string, notificationId: string): Promise<NotificationItem> {
    if (isDatabaseConnected) {
      try {
        const notif = await prisma.notification.findFirst({
          where: { id: notificationId, userId }
        });

        if (!notif) {
          throw new NotFoundError('Notification not found');
        }

        const updated = await prisma.notification.update({
          where: { id: notificationId },
          data: { isRead: true }
        });

        const record: NotificationItem = {
          id: updated.id,
          userId: updated.userId,
          title: updated.title,
          message: updated.message,
          type: 'INFO',
          isRead: updated.isRead,
          createdAt: updated.createdAt.toISOString()
        };

        const existing = this.memoryNotifications.get(userId) || [];
        const index = existing.findIndex((n) => n.id === notificationId);
        if (index !== -1) {
          existing[index] = record;
          this.memoryNotifications.set(userId, existing);
        }

        return record;
      } catch (err) {
        if (err instanceof NotFoundError) throw err;
        // Fall back to memory
      }
    }

    const userNotifs = this.memoryNotifications.get(userId) || this.memoryNotifications.get('demo-user-1') || [];
    const item = userNotifs.find((n) => n.id === notificationId);
    if (!item) {
      throw new NotFoundError('Notification not found');
    }

    item.isRead = true;
    return item;
  }

  /**
   * Create a notification
   */
  public async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string = 'INFO'
  ): Promise<NotificationItem> {
    if (isDatabaseConnected) {
      try {
        const created = await prisma.notification.create({
          data: {
            userId,
            title,
            message,
            isRead: false
          }
        });

        const record: NotificationItem = {
          id: created.id,
          userId: created.userId,
          title: created.title,
          message: created.message,
          type,
          isRead: created.isRead,
          createdAt: created.createdAt.toISOString()
        };

        const existing = this.memoryNotifications.get(userId) || [];
        this.memoryNotifications.set(userId, [record, ...existing]);
        return record;
      } catch (err) {
        // Fall back to memory
      }
    }

    const newRecord: NotificationItem = {
      id: randomUUID(),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    const existing = this.memoryNotifications.get(userId) || [];
    this.memoryNotifications.set(userId, [newRecord, ...existing]);
    return newRecord;
  }
}

export const notificationService = new NotificationService();
