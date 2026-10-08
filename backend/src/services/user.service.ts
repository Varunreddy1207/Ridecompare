import { prisma, isDatabaseConnected } from '../config/database';
import { UpdateProfileInput } from '../schemas/user.schema';
import { UserProfileResponse } from '../types/auth.types';
import { NotFoundError } from '../utils/errors';
import { authService } from './auth.service';

export class UserService {
  public async getProfile(userId: string): Promise<UserProfileResponse> {
    return authService.getCurrentUser(userId);
  }

  public async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfileResponse> {
    if (isDatabaseConnected) {
      try {
        const updated = await prisma.user.update({
          where: { id: userId },
          data: {
            ...(input.name !== undefined && { name: input.name }),
            ...(input.phone !== undefined && { phone: input.phone })
          }
        });

        return {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString()
        };
      } catch (err) {
        throw new NotFoundError('User profile not found');
      }
    }

    // Memory fallback
    const memUser = authService.getMemoryUserById(userId);
    if (!memUser) {
      throw new NotFoundError('User profile not found');
    }

    if (input.name !== undefined) memUser.name = input.name;
    if (input.phone !== undefined) memUser.phone = input.phone;
    if (input.avatarUrl !== undefined) memUser.avatarUrl = input.avatarUrl;
    memUser.updatedAt = new Date();

    return {
      id: memUser.id,
      name: memUser.name,
      email: memUser.email,
      phone: memUser.phone,
      avatarUrl: memUser.avatarUrl,
      createdAt: memUser.createdAt.toISOString(),
      updatedAt: memUser.updatedAt.toISOString()
    };
  }

  public async deleteAccount(userId: string): Promise<void> {
    let deletedFromDb = false;

    if (isDatabaseConnected) {
      try {
        await prisma.user.delete({
          where: { id: userId }
        });
        deletedFromDb = true;
      } catch (err: any) {
        if (err.code !== 'P2025') {
          throw err;
        }
      }
    }

    const deletedFromMemory = authService.deleteMemoryUser(userId);

    if (!deletedFromDb && !deletedFromMemory && !isDatabaseConnected) {
      throw new NotFoundError('User profile not found in database');
    }
  }
}

export const userService = new UserService();
