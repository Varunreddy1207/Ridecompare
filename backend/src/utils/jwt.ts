import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthTokenPayload } from '../types/auth.types';
import { UnauthorizedError } from './errors';

export function signToken(payload: AuthTokenPayload): string {
  const options: SignOptions = {
    expiresIn: (env.JWT_EXPIRES_IN || '7d') as any
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): AuthTokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired authentication token');
  }
}
