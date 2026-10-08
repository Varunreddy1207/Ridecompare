import { Request, Response, NextFunction } from 'express';
import { locationService } from '../services/location.service';
import { sendSuccess } from '../utils/response';
import { UnauthorizedError } from '../utils/errors';

export class LocationController {
  /**
   * Search locations autocomplete
   * GET /api/locations/search?q=kolhapur
   */
  public async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q : '';
      const locations = await locationService.searchLocations(q);
      sendSuccess(res, locations, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get saved locations for authenticated user
   * GET /api/locations/saved
   */
  public async getSaved(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const saved = await locationService.getSavedLocations(req.user.userId);
      sendSuccess(res, saved, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save a new location for user
   * POST /api/locations/saved
   */
  public async createSaved(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const created = await locationService.createSavedLocation(req.user.userId, req.body);
      sendSuccess(res, created, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a saved location
   * DELETE /api/locations/saved/:id
   */
  public async deleteSaved(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const { id } = req.params;
      await locationService.deleteSavedLocation(req.user.userId, id);
      sendSuccess(res, { message: 'Location deleted successfully' }, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const locationController = new LocationController();
