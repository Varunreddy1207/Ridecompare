import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { UnauthorizedError } from '../utils/errors';

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientMeta = {
        deviceId: (req.body.deviceId || req.headers['x-device-id']) as string | undefined,
        deviceName: (req.body.deviceName || req.headers['user-agent']) as string | undefined,
        ipAddress: req.ip
      };
      const result = await authService.register(req.body, clientMeta);
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: result.user,
        token: result.token,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientMeta = {
        deviceId: (req.body.deviceId || req.headers['x-device-id']) as string | undefined,
        deviceName: (req.body.deviceName || req.headers['user-agent']) as string | undefined,
        ipAddress: req.ip
      };
      const result = await authService.login(req.body, clientMeta);
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        user: result.user,
        token: result.token,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  public async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      const user = await authService.getCurrentUser(req.user.userId);
      res.status(200).json({
        success: true,
        user,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || req.body?.userId;
      const deviceId = (req.body?.deviceId || req.headers['x-device-id']) as string | undefined;
      await authService.logout(userId, deviceId);
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        data: { message: 'Logged out successfully' }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
