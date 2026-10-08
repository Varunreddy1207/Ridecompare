import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { prisma, isDatabaseConnected } from '../config/database';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { AuthSuccessData, UserProfileResponse } from '../types/auth.types';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import { signToken } from '../utils/jwt';

interface InMemoryUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  // In-memory user store fallback
  private memoryUsers: Map<string, InMemoryUser> = new Map();

  constructor() {
    // Seed default demo user in memory fallback
    const demoPasswordHash = bcrypt.hashSync('Password123!', 10);
    const demoUser: InMemoryUser = {
      id: 'demo-user-1',
      name: 'Varun Reddy',
      email: 'varunreddy@gmail.com',
      phone: '+91 98765 43210',
      password: demoPasswordHash,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.memoryUsers.set(demoUser.email.toLowerCase(), demoUser);
  }

  public async register(input: RegisterInput): Promise<AuthSuccessData> {
    const emailNormalized = input.email.toLowerCase().trim();

    // 1. Check existing in Prisma or Memory
    if (isDatabaseConnected) {
      try {
        const existing = await prisma.user.findUnique({
          where: { email: emailNormalized }
        });
        if (existing) {
          throw new ConflictError('A user with this email address already exists');
        }
      } catch (err: any) {
        if (err instanceof ConflictError) throw err;
      }
    } else {
      if (this.memoryUsers.has(emailNormalized)) {
        throw new ConflictError('A user with this email address already exists');
      }
    }

    // 2. Hash Password (never store plain text)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    let createdUser: UserProfileResponse;
    const userId = randomUUID();

    if (isDatabaseConnected) {
      try {
        const dbUser = await prisma.user.create({
          data: {
            id: userId,
            name: input.name.trim(),
            email: emailNormalized,
            phone: input.phone || null,
            password: passwordHash
          }
        });
        createdUser = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          phone: dbUser.phone,
          createdAt: dbUser.createdAt.toISOString(),
          updatedAt: dbUser.updatedAt.toISOString()
        };
      } catch (err: any) {
        if (err.code === 'P2002') {
          throw new ConflictError('A user with this email address already exists');
        }
        console.warn('Prisma create failed, falling back to in-memory user store:', err.message);
        const memUser: InMemoryUser = {
          id: userId,
          name: input.name.trim(),
          email: emailNormalized,
          phone: input.phone || null,
          password: passwordHash,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.memoryUsers.set(emailNormalized, memUser);
        createdUser = {
          id: memUser.id,
          name: memUser.name,
          email: memUser.email,
          phone: memUser.phone,
          createdAt: memUser.createdAt.toISOString(),
          updatedAt: memUser.updatedAt.toISOString()
        };
      }
    } else {
      const memUser: InMemoryUser = {
        id: userId,
        name: input.name.trim(),
        email: emailNormalized,
        phone: input.phone || null,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.memoryUsers.set(emailNormalized, memUser);
      createdUser = {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        phone: memUser.phone,
        createdAt: memUser.createdAt.toISOString(),
        updatedAt: memUser.updatedAt.toISOString()
      };
    }

    // Always mirror in memory store for resilient instant login fallback
    this.memoryUsers.set(emailNormalized, {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone || null,
      password: passwordHash,
      createdAt: new Date(createdUser.createdAt),
      updatedAt: new Date(createdUser.updatedAt || createdUser.createdAt)
    });

    // 3. Sign JWT
    const token = signToken({
      userId: createdUser.id,
      email: createdUser.email
    });

    return {
      token,
      user: createdUser
    };
  }

  public async login(input: LoginInput): Promise<AuthSuccessData> {
    const emailNormalized = input.email.toLowerCase().trim();

    let userRecord: { id: string; name: string; email: string; phone: string | null; password?: string; createdAt: Date; updatedAt?: Date } | null = null;

    if (isDatabaseConnected) {
      try {
        userRecord = await prisma.user.findUnique({
          where: { email: emailNormalized }
        });
      } catch (err) {
        console.warn('Prisma login findUnique failed, checking memory store:', err);
        userRecord = null;
      }
    }

    // Fallback: If not found in database or if database is offline, check in-memory cache
    if (!userRecord) {
      userRecord = this.memoryUsers.get(emailNormalized) || null;
    }

    if (!userRecord || !userRecord.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(input.password, userRecord.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Mirror to memory store for quick retrieval
    this.memoryUsers.set(emailNormalized, {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      password: userRecord.password,
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt || userRecord.createdAt
    });

    const token = signToken({
      userId: userRecord.id,
      email: userRecord.email
    });

    const userProfile: UserProfileResponse = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      createdAt: userRecord.createdAt.toISOString(),
      updatedAt: userRecord.updatedAt ? userRecord.updatedAt.toISOString() : undefined
    };

    return {
      token,
      user: userProfile
    };
  }

  public async getCurrentUser(userId: string): Promise<UserProfileResponse> {
    if (isDatabaseConnected) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
          };
        }
      } catch (err) {
        // Fall back to memory
      }
    }

    // Search memory
    for (const memUser of this.memoryUsers.values()) {
      if (memUser.id === userId) {
        return {
          id: memUser.id,
          name: memUser.name,
          email: memUser.email,
          phone: memUser.phone,
          createdAt: memUser.createdAt.toISOString(),
          updatedAt: memUser.updatedAt.toISOString()
        };
      }
    }

    throw new NotFoundError('User not found');
  }

  public getMemoryUserById(userId: string): InMemoryUser | null {
    for (const memUser of this.memoryUsers.values()) {
      if (memUser.id === userId) return memUser;
    }
    return null;
  }

  public deleteMemoryUser(userId: string): boolean {
    for (const [email, memUser] of this.memoryUsers.entries()) {
      if (memUser.id === userId) {
        this.memoryUsers.delete(email);
        return true;
      }
    }
    return false;
  }
}

export const authService = new AuthService();
