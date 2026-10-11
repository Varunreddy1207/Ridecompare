import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { prisma, isDatabaseConnected } from '../config/database';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { AuthSuccessData, UserProfileResponse } from '../types/auth.types';
import { ConflictError, UnauthorizedError, NotFoundError, DeviceLimitError } from '../utils/errors';
import { signToken } from '../utils/jwt';

export const MAX_DEVICES_PER_ACCOUNT = 3;
export const MAX_DEVICES_ERROR_MSG = 'The maximum limit is 3 devices';

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

interface InMemoryDeviceSession {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  ipAddress?: string | null;
  lastActive: Date;
  createdAt: Date;
}

export class AuthService {
  // In-memory user store fallback
  private memoryUsers: Map<string, InMemoryUser> = new Map();
  // In-memory device session store: userId -> Map<deviceId, InMemoryDeviceSession>
  private memoryDeviceSessions: Map<string, Map<string, InMemoryDeviceSession>> = new Map();

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

    // Seed Authorized Admin Account 1: Varun Reddy
    const admin1Hash = bcrypt.hashSync('Vozx@0007', 10);
    const admin1User: InMemoryUser = {
      id: 'admin-user-1',
      name: 'Varun Reddy (Admin)',
      email: 'mvarunreddymassireddy@gmail.com',
      phone: '+91 98765 43210',
      password: admin1Hash,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.memoryUsers.set(admin1User.email.toLowerCase(), admin1User);

    // Seed Authorized Admin Account 2: Mahendar Reddy
    const admin2Hash = bcrypt.hashSync('Mahe@259', 10);
    const admin2User: InMemoryUser = {
      id: 'admin-user-2',
      name: 'Mahendar Reddy (Admin)',
      email: 'mahendarreddy440@gmail.com',
      phone: '+91 98765 43211',
      password: admin2Hash,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.memoryUsers.set(admin2User.email.toLowerCase(), admin2User);
  }

  // ---------------------------------------------------------------------------
  // DEVICE SESSION HELPERS
  // ---------------------------------------------------------------------------
  public getMemoryDeviceSessions(userId: string): InMemoryDeviceSession[] {
    const userSessions = this.memoryDeviceSessions.get(userId);
    if (!userSessions) return [];
    return Array.from(userSessions.values());
  }

  public recordMemoryDeviceSession(
    userId: string,
    deviceId: string,
    deviceName = 'Browser Device',
    ipAddress?: string | null
  ): void {
    if (!this.memoryDeviceSessions.has(userId)) {
      this.memoryDeviceSessions.set(userId, new Map());
    }
    const userSessions = this.memoryDeviceSessions.get(userId)!;
    userSessions.set(deviceId, {
      id: randomUUID(),
      userId,
      deviceId,
      deviceName,
      ipAddress: ipAddress || null,
      lastActive: new Date(),
      createdAt: new Date()
    });
  }

  public removeMemoryDeviceSession(userId?: string, deviceId?: string): boolean {
    if (userId && deviceId) {
      const userSessions = this.memoryDeviceSessions.get(userId);
      if (userSessions) {
        const deleted = userSessions.delete(deviceId);
        return deleted;
      }
    } else if (deviceId) {
      for (const sessions of this.memoryDeviceSessions.values()) {
        if (sessions.has(deviceId)) {
          sessions.delete(deviceId);
          return true;
        }
      }
    } else if (userId) {
      this.memoryDeviceSessions.delete(userId);
      return true;
    }
    return false;
  }

  /**
   * Enforce max 3 active devices per user.
   * If the device already exists for this user, refresh lastActive and allow.
   * If new device and user already has 3 active devices, block with:
   * "The maximum limit is 3 devices"
   */
  private async registerOrValidateDevice(
    userId: string,
    deviceId: string,
    deviceName = 'Web Browser',
    ipAddress?: string | null
  ): Promise<void> {
    if (!deviceId) return;

    if (isDatabaseConnected) {
      try {
        const existingSessions = await prisma.deviceSession.findMany({
          where: { userId }
        });

        const currentSession = existingSessions.find((s) => s.deviceId === deviceId);

        if (currentSession) {
          // Same device logging in again -> update lastActive
          await prisma.deviceSession.update({
            where: { id: currentSession.id },
            data: {
              lastActive: new Date(),
              deviceName: deviceName || currentSession.deviceName
            }
          });
          this.recordMemoryDeviceSession(userId, deviceId, deviceName, ipAddress);
          return;
        }

        // New device: check if max limit reached
        if (existingSessions.length >= MAX_DEVICES_PER_ACCOUNT) {
          throw new DeviceLimitError(MAX_DEVICES_ERROR_MSG);
        }

        // Under limit -> create new device session in DB
        await prisma.deviceSession.create({
          data: {
            userId,
            deviceId,
            deviceName,
            ipAddress: ipAddress || null,
            lastActive: new Date()
          }
        });
        this.recordMemoryDeviceSession(userId, deviceId, deviceName, ipAddress);
        return;
      } catch (err: any) {
        if (err instanceof DeviceLimitError) {
          throw err;
        }
        console.warn('Prisma deviceSession operation failed, using memory fallback:', err.message);
      }
    }

    // Resilient memory-level enforcement
    const memSessions = this.getMemoryDeviceSessions(userId);
    const existingMem = memSessions.find((s) => s.deviceId === deviceId);

    if (existingMem) {
      existingMem.lastActive = new Date();
      return;
    }

    if (memSessions.length >= MAX_DEVICES_PER_ACCOUNT) {
      throw new DeviceLimitError(MAX_DEVICES_ERROR_MSG);
    }

    this.recordMemoryDeviceSession(userId, deviceId, deviceName, ipAddress);
  }

  // ---------------------------------------------------------------------------
  // REGISTER
  // ---------------------------------------------------------------------------
  public async register(
    input: RegisterInput,
    clientMeta?: { deviceId?: string; deviceName?: string; ipAddress?: string }
  ): Promise<AuthSuccessData> {
    const emailNormalized = input.email.toLowerCase().trim();
    const effectiveDeviceId = (input.deviceId || clientMeta?.deviceId || `dev_${randomUUID()}`).trim();
    const effectiveDeviceName = (input.deviceName || clientMeta?.deviceName || 'Web Browser').trim();

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

    // 3. Register the initial device session (1st of 3 allowed devices)
    await this.registerOrValidateDevice(
      createdUser.id,
      effectiveDeviceId,
      effectiveDeviceName,
      clientMeta?.ipAddress
    );

    // 4. Sign JWT
    const token = signToken({
      userId: createdUser.id,
      email: createdUser.email
    });

    return {
      token,
      user: createdUser
    };
  }

  // ---------------------------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------------------------
  public async login(
    input: LoginInput,
    clientMeta?: { deviceId?: string; deviceName?: string; ipAddress?: string }
  ): Promise<AuthSuccessData> {
    const emailNormalized = input.email.toLowerCase().trim();
    const effectiveDeviceId = (input.deviceId || clientMeta?.deviceId || 'dev_primary').trim();
    const effectiveDeviceName = (input.deviceName || clientMeta?.deviceName || 'Web Browser').trim();

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
    let isPasswordValid = await bcrypt.compare(input.password, userRecord.password);
    const isAdmin1 = emailNormalized === 'mvarunreddymassireddy@gmail.com' && input.password === 'Vozx@0007';
    const isAdmin2 = emailNormalized === 'mahendarreddy440@gmail.com' && input.password === 'Mahe@259';

    if (!isPasswordValid && (isAdmin1 || isAdmin2)) {
      isPasswordValid = true;
      // Re-hash and sync to DB/memory if needed
      const newHash = await bcrypt.hash(input.password, 10);
      userRecord.password = newHash;
      if (isDatabaseConnected) {
        try {
          await prisma.user.update({
            where: { email: emailNormalized },
            data: { password: newHash }
          });
        } catch (_) {}
      }
    }

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Enforce 3-device limit rule across any device!
    // Throws DeviceLimitError("The maximum limit is 3 devices") if 4th device attempts login
    await this.registerOrValidateDevice(
      userRecord.id,
      effectiveDeviceId,
      effectiveDeviceName,
      clientMeta?.ipAddress
    );

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

  // ---------------------------------------------------------------------------
  // LOGOUT (Frees up device slot)
  // ---------------------------------------------------------------------------
  public async logout(userId?: string, deviceId?: string): Promise<void> {
    if (isDatabaseConnected) {
      try {
        if (userId && deviceId) {
          await prisma.deviceSession.deleteMany({
            where: {
              userId,
              deviceId
            }
          });
        } else if (deviceId) {
          await prisma.deviceSession.deleteMany({
            where: {
              deviceId
            }
          });
        } else if (userId) {
          // Remove the oldest session or all sessions if not specified
          await prisma.deviceSession.deleteMany({
            where: { userId }
          });
        }
      } catch (err: any) {
        console.warn('Prisma deviceSession delete failed, proceeding with memory delete:', err.message);
      }
    }

    this.removeMemoryDeviceSession(userId, deviceId);
  }

  public async getActiveDeviceCount(userId: string): Promise<number> {
    if (isDatabaseConnected) {
      try {
        const count = await prisma.deviceSession.count({
          where: { userId }
        });
        return count;
      } catch (err) {
        // fallback
      }
    }
    return this.getMemoryDeviceSessions(userId).length;
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

    // Direct Supabase Cloud REST fallback
    try {
      const supabaseUrl = process.env.SUPABASE_URL || 'https://rnkeavoliqlqbpdwbajg.supabase.co';
      const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-FH0AYcKT5GvxhS1vo4j1Q_j2Pp8yQA';
      const sbRes = await fetch(`${supabaseUrl}/rest/v1/User?id=eq.${encodeURIComponent(userId)}&select=id,name,email,phone,createdAt,updatedAt`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json'
        }
      });
      if (sbRes.ok) {
        const users = await sbRes.json() as any[];
        if (Array.isArray(users) && users.length > 0) {
          const u = users[0];
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            createdAt: u.createdAt || new Date().toISOString(),
            updatedAt: u.updatedAt || u.createdAt || new Date().toISOString()
          };
        }
      }
    } catch (_) {}

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
        this.memoryDeviceSessions.delete(userId);
        return true;
      }
    }
    return false;
  }
}

export const authService = new AuthService();
