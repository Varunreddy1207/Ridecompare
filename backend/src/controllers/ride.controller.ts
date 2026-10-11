import { Request, Response, NextFunction } from 'express';
import { comparisonService } from '../services/comparison.service';
import { rideService } from '../services/ride.service';
import { sendSuccess } from '../utils/response';
import { UnauthorizedError } from '../utils/errors';

export class RideController {
  /**
   * Compare rides across providers
   * POST /api/rides/compare
   */
  public async compare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pickup, destination } = req.body;
      const userId = req.user?.userId;

      const result = await comparisonService.compareRides(pickup, destination, userId);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user ride history
   * GET /api/rides/history
   */
  public async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = await rideService.getRideHistory(req.user.userId, page, limit);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mock ride booking
   * POST /api/rides/book
   */
  public async book(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || 'demo-user-1';
      const { provider, vehicleType, pickupAddress, destinationAddress, price } = req.body;

      const result = await rideService.createRideHistory({
        userId,
        provider,
        vehicleType,
        pickupAddress,
        destinationAddress,
        price: Number(price) || 0
      });

      sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recent searches for authenticated user (cross-device sync)
   * GET /api/rides/recent-searches
   */
  public async getRecentSearches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const email = req.user?.email || (req.headers['x-user-email'] as string);

      if (!userId && !email) {
        sendSuccess(res, [], 200);
        return;
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
      const searches = await rideService.getRecentSearches(userId || '', email, limit);
      sendSuccess(res, searches, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save a recent search for authenticated user (cross-device sync)
   * POST /api/rides/recent-searches
   */
  public async saveRecentSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const email = req.user?.email || (req.headers['x-user-email'] as string);

      if (!userId && !email) {
        throw new UnauthorizedError('User authentication required to save search history');
      }

      const { name, city, fare, pickup } = req.body;
      if (!name) {
        sendSuccess(res, null, 400);
        return;
      }

      const saved = await rideService.saveRecentSearch(userId || '', email, { name, city, fare, pickup });
      sendSuccess(res, saved, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clear recent searches for user
   * DELETE /api/rides/recent-searches
   */
  public async clearRecentSearches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const email = req.user?.email || (req.headers['x-user-email'] as string);
      const searchTarget = req.body?.id || req.body?.name || req.query?.id || req.query?.name;

      if (userId || email) {
        if (searchTarget) {
          await rideService.deleteRecentSearch(userId || '', email, searchTarget as string);
        } else {
          await rideService.clearRecentSearches(userId || '', email);
        }
      }
      sendSuccess(res, { success: true }, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const rideController = new RideController();
