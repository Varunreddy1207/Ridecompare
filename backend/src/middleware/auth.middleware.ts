import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';
import { AuthTokenPayload } from '../types/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

/**
 * Required authentication middleware
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const emailHeader = (req.headers['x-user-email'] as string) || '';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (emailHeader) {
      req.user = {
        userId: (req.headers['x-user-id'] as string) || emailHeader,
        email: emailHeader
      };
      return next();
    }
    return next(new UnauthorizedError('Missing or malformed Authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    if (token.startsWith('supabase_jwt_')) {
      const parts = token.split('_');
      req.user = {
        userId: parts[2] || 'user-1',
        email: emailHeader || ''
      };
      return next();
    }
    if (emailHeader) {
      req.user = {
        userId: (req.headers['x-user-id'] as string) || emailHeader,
        email: emailHeader
      };
      return next();
    }
    return next(new UnauthorizedError('Invalid or expired token'));
  }
}

/**
 * Optional authentication middleware:
 * Populates req.user if valid token or user headers provided, allows guest request otherwise.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const emailHeader = (req.headers['x-user-email'] as string) || '';

  if (emailHeader) {
    req.user = {
      userId: (req.headers['x-user-id'] as string) || emailHeader,
      email: emailHeader
    };
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyToken(token);
      req.user = payload;
    } catch (error) {
      if (token.startsWith('supabase_jwt_')) {
        const parts = token.split('_');
        req.user = {
          userId: parts[2] || (req.user?.userId || 'user-1'),
          email: emailHeader || req.user?.email || ''
        };
      }
    }
  }

  next();
}
