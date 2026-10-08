import { Request, Response, NextFunction } from 'express';
import { AppError, NotFoundError } from '../utils/errors';
import { sendError } from '../utils/response';
import { env } from '../config/env';

/**
 * 404 Not Found Middleware
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}

/**
 * Centralized Error Handling Middleware
 */
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  if (env.NODE_ENV !== 'test') {
    console.error(`[Error] ${err.name || 'Error'}: ${err.message}`);
    if (err.stack && env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
  }

  // Handle custom AppError hierarchy
  if (err instanceof AppError) {
    return sendError(res, err.code, err.message, err.statusCode);
  }

  // Handle Express body-parser JSON syntax error
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err)) {
    return sendError(res, 'INVALID_JSON', 'Malformed JSON in request body', 400);
  }

  // Handle general unhandled internal errors
  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred'
      : err.message || 'Internal Server Error';

  return sendError(res, 'INTERNAL_SERVER_ERROR', message, 500);
}
