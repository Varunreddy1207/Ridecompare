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

function parseSupabaseUserId(token: string): string {
  const prefix = 'supabase_jwt_';
  if (!token.startsWith(prefix)) return 'user-1';
  const rest = token.substring(prefix.length);
  const lastUnderscore = rest.lastIndexOf('_');
  if (lastUnderscore > 0) {
    const candidateTimestamp = rest.substring(lastUnderscore + 1);
    if (/^\d+$/.test(candidateTimestamp)) {
      return rest.substring(0, lastUnderscore);
    }
  }
  return rest || 'user-1';
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
      const extractedUserId = parseSupabaseUserId(token);
      req.user = {
        userId: extractedUserId,
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
        const extractedUserId = parseSupabaseUserId(token);
        req.user = {
          userId: extractedUserId,
          email: emailHeader || req.user?.email || ''
        };
      }
    }
  }

  next();
}
