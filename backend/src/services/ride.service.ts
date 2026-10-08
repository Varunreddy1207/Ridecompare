import { randomUUID } from 'crypto';
import { prisma, isDatabaseConnected } from '../config/database';
import { RideHistoryItem, PaginatedResult } from '../types/ride.types';

export interface CreateRideHistoryInput {
  userId: string;
  provider: 'UBER' | 'OLA' | 'RAPIDO';
  vehicleType: 'BIKE' | 'AUTO' | 'CAR';
  pickupAddress: string;
  destinationAddress: string;
  price: number;
  currency?: string;
  status?: string;
  rideDate?: Date;
}

export class RideService {
  // In-memory fallback store
  private memoryHistory: Map<string, RideHistoryItem[]> = new Map();

  constructor() {
    this.seedDefaultHistory();
  }

  private seedDefaultHistory(): void {
    const demoUserId = 'demo-user-1';
    const sampleHistory: RideHistoryItem[] = [
      {
        id: 'hist-1',
        userId: demoUserId,
        provider: 'RAPIDO',
        vehicleType: 'BIKE',
        pickupAddress: 'Shahupuri, Kolhapur',
        destinationAddress: 'Sanjay Ghodawat University, Kolhapur',
        price: 78,
        currency: 'INR',
        status: 'COMPLETED',
        rideDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      },
      {
        id: 'hist-2',
        userId: demoUserId,
        provider: 'OLA',
        vehicleType: 'AUTO',
        pickupAddress: 'Mahalaxmi Temple, Kolhapur',
        destinationAddress: 'DYP City Mall, Kolhapur',
        price: 135,
        currency: 'INR',
        status: 'COMPLETED',
        rideDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'hist-3',
        userId: demoUserId,
        provider: 'UBER',
        vehicleType: 'CAR',
        pickupAddress: 'Central Bus Stand (CBS), Kolhapur',
        destinationAddress: 'Kolhapur Airport (Ujalaiwadi)',
        price: 245,
        currency: 'INR',
        status: 'COMPLETED',
        rideDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      }
    ];

    this.memoryHistory.set(demoUserId, sampleHistory);
  }

  /**
   * Get paginated ride history for a user
   */
  public async getRideHistory(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<RideHistoryItem>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    if (isDatabaseConnected) {
      try {
        const [total, items] = await Promise.all([
          prisma.rideHistory.count({ where: { userId } }),
          prisma.rideHistory.findMany({
            where: { userId },
            skip,
            take: safeLimit,
            orderBy: { createdAt: 'desc' }
          })
        ]);

        const mapped: RideHistoryItem[] = items.map((r) => ({
          id: r.id,
          userId: r.userId,
          provider: r.provider,
          vehicleType: r.vehicleType,
          pickupAddress: r.pickup,
          destinationAddress: r.destination,
          pickup: r.pickup,
          destination: r.destination,
          price: r.price,
          currency: r.currency,
          status: r.status,
          rideDate: r.createdAt.toISOString(),
          date: r.createdAt.toISOString(),
          createdAt: r.createdAt.toISOString()
        }));

        return {
          items: mapped,
          pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit) || 1
          }
        };
      } catch (err) {
        // Fall back to memory
      }
    }

    const userHistory = this.memoryHistory.get(userId) || this.memoryHistory.get('demo-user-1') || [];
    const total = userHistory.length;
    const paginated = userHistory.slice(skip, skip + safeLimit);

    return {
      items: paginated,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit) || 1
      }
    };
  }

  /**
   * Create a ride history entry
   */
  public async createRideHistory(input: CreateRideHistoryInput): Promise<RideHistoryItem> {
    const rideDate = input.rideDate || new Date();
    const status = input.status || 'COMPLETED';
    const currency = input.currency || 'INR';

    if (isDatabaseConnected) {
      try {
        const created = await prisma.rideHistory.create({
          data: {
            userId: input.userId,
            provider: input.provider,
            vehicleType: input.vehicleType,
            pickup: input.pickupAddress || (input as any).pickup || 'Pickup',
            destination: input.destinationAddress || (input as any).destination || 'Destination',
            price: input.price,
            currency,
            status
          }
        });

        const record: RideHistoryItem = {
          id: created.id,
          userId: created.userId,
          provider: created.provider,
          vehicleType: created.vehicleType,
          pickupAddress: created.pickup,
          destinationAddress: created.destination,
          pickup: created.pickup,
          destination: created.destination,
          price: created.price,
          currency: created.currency,
          status: created.status,
          rideDate: created.createdAt.toISOString(),
          date: created.createdAt.toISOString(),
          createdAt: created.createdAt.toISOString()
        };

        const existing = this.memoryHistory.get(input.userId) || [];
        this.memoryHistory.set(input.userId, [record, ...existing]);
        return record;
      } catch (err) {
        // Fall back to memory
      }
    }

    const newRecord: RideHistoryItem = {
      id: randomUUID(),
      userId: input.userId,
      provider: input.provider,
      vehicleType: input.vehicleType,
      pickupAddress: input.pickupAddress,
      destinationAddress: input.destinationAddress,
      price: input.price,
      currency,
      status,
      rideDate: rideDate.toISOString(),
      createdAt: new Date().toISOString()
    };

    const existing = this.memoryHistory.get(input.userId) || [];
    this.memoryHistory.set(input.userId, [newRecord, ...existing]);
    return newRecord;
  }
}

export const rideService = new RideService();
