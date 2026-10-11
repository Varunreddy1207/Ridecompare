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

  // In-memory fallback for recent searches across devices
  private memoryRecentSearches: Map<string, any[]> = new Map();

  /**
   * Get recent searches for a user (across all devices)
   */
  public async getRecentSearches(userId: string, email?: string, limit: number = 8): Promise<any[]> {
    const safeLimit = Math.min(20, Math.max(1, limit));
    const targetUserId = userId || email || 'guest';

    if (isDatabaseConnected) {
      try {
        let actualUserId: string | null = null;
        if (userId && !userId.includes('@')) {
          actualUserId = userId;
        } else if (email) {
          const u = await prisma.user.findUnique({ where: { email }, select: { id: true } });
          if (u) actualUserId = u.id;
        }

        const searches = await prisma.rideSearch.findMany({
          where: {
            OR: [
              ...(actualUserId ? [{ userId: actualUserId }] : []),
              { userId: targetUserId },
              ...(email ? [{ user: { email } }] : [])
            ]
          },
          orderBy: { createdAt: 'desc' },
          take: Math.max(safeLimit * 3, 25),
          include: {
            quotes: {
              orderBy: { price: 'asc' },
              take: 1
            }
          }
        });

        if (searches && searches.length > 0) {
          const uniqueItems: any[] = [];
          const seen = new Set<string>();

          for (const s of searches) {
            const dest = s.destination || '';
            const commaIndex = dest.indexOf(',');
            const name = commaIndex > 0 ? dest.substring(0, commaIndex).trim() : dest;
            const city = commaIndex > 0 ? dest.substring(commaIndex + 1).trim() : 'Kolhapur';
            const lowestPrice = s.quotes?.[0]?.price;
            const fare = lowestPrice ? `₹${Math.round(lowestPrice)}` : '₹78';

            const lower = name.toLowerCase();
            if (!seen.has(lower)) {
              seen.add(lower);
              uniqueItems.push({
                id: s.id,
                name,
                city,
                fare,
                pickup: s.pickup,
                timestamp: s.createdAt.getTime()
              });
              if (uniqueItems.length >= safeLimit) break;
            }
          }
          return uniqueItems;
        }
      } catch (err) {
        console.warn('[RideService] Database error fetching recent searches:', err);
      }
    }

    const memSearches = this.memoryRecentSearches.get(targetUserId) || 
                        (email ? this.memoryRecentSearches.get(email) : null) || 
                        [];
    return memSearches.slice(0, safeLimit);
  }

  /**
   * Save a recent search for a user (persisted in database so it syncs across all devices)
   */
  public async saveRecentSearch(
    userId: string,
    email: string | undefined,
    data: { name: string; city?: string; fare?: string; pickup?: string }
  ): Promise<any> {
    const searchId = randomUUID();
    const cleanName = (data.name || '').trim();
    const cleanCity = (data.city || 'Kolhapur').trim();
    const fullDestination = cleanCity ? `${cleanName}, ${cleanCity}` : cleanName;
    const cleanPickup = (data.pickup || 'Current Location').trim();
    const targetUserId = userId || email || 'guest';
    
    let numericPrice = 78;
    if (data.fare) {
      const match = data.fare.toString().match(/\d+/);
      if (match) numericPrice = parseInt(match[0], 10);
    }

    const item = {
      id: searchId,
      name: cleanName,
      city: cleanCity,
      fare: `₹${numericPrice}`,
      pickup: cleanPickup,
      timestamp: Date.now()
    };

    const existing = this.memoryRecentSearches.get(targetUserId) || [];
    const filtered = existing.filter(s => s.name.toLowerCase() !== cleanName.toLowerCase());
    const updated = [item, ...filtered].slice(0, 8);
    this.memoryRecentSearches.set(targetUserId, updated);
    if (email && email !== targetUserId) {
      this.memoryRecentSearches.set(email, updated);
    }

    if (isDatabaseConnected) {
      try {
        let actualUserId: string | null = null;
        if (userId && !userId.includes('@')) {
          const userExists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
          if (userExists) actualUserId = userExists.id;
        }
        if (!actualUserId && email) {
          const userByEmail = await prisma.user.findUnique({ where: { email }, select: { id: true } });
          if (userByEmail) actualUserId = userByEmail.id;
        }

        if (actualUserId) {
          await prisma.rideSearch.create({
            data: {
              id: searchId,
              userId: actualUserId,
              pickup: cleanPickup,
              destination: fullDestination,
              distanceKm: 5.0,
              quotes: {
                create: {
                  provider: 'RAPIDO',
                  vehicleType: 'BIKE',
                  price: numericPrice,
                  currency: 'INR',
                  etaMinutes: 3,
                  rating: 4.8
                }
              }
            }
          });
        }
      } catch (err) {
        console.warn('[RideService] Database error saving recent search:', err);
      }
    }

    return item;
  }

  /**
   * Delete a single recent search for a user
   */
  public async deleteRecentSearch(userId: string, email: string | undefined, searchIdOrName: string): Promise<void> {
    const targetUserId = userId || email || 'guest';
    const target = (searchIdOrName || '').trim();
    if (!target) return;

    const existing = this.memoryRecentSearches.get(targetUserId) || [];
    const filtered = existing.filter(s => s.id !== target && s.name.toLowerCase() !== target.toLowerCase());
    this.memoryRecentSearches.set(targetUserId, filtered);
    if (email) {
      const existingEmail = this.memoryRecentSearches.get(email) || [];
      this.memoryRecentSearches.set(email, existingEmail.filter(s => s.id !== target && s.name.toLowerCase() !== target.toLowerCase()));
    }

    if (isDatabaseConnected) {
      try {
        let actualUserId: string | null = null;
        if (userId && !userId.includes('@')) {
          const u = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
          if (u) actualUserId = u.id;
        }
        if (!actualUserId && email) {
          const u = await prisma.user.findUnique({ where: { email }, select: { id: true } });
          if (u) actualUserId = u.id;
        }

        if (actualUserId) {
          await prisma.rideSearch.deleteMany({
            where: {
              userId: actualUserId,
              OR: [
                { id: target },
                { destination: { contains: target, mode: 'insensitive' } }
              ]
            }
          });
        }
      } catch (err) {
        console.warn('[RideService] Database error deleting search:', err);
      }
    }
  }

  /**
   * Clear recent searches for a user
   */
  public async clearRecentSearches(userId: string, email?: string): Promise<void> {
    const targetUserId = userId || email || 'guest';
    this.memoryRecentSearches.delete(targetUserId);
    if (email) this.memoryRecentSearches.delete(email);

    if (isDatabaseConnected) {
      try {
        let actualUserId: string | null = null;
        if (userId && !userId.includes('@')) {
          actualUserId = userId;
        } else if (email) {
          const u = await prisma.user.findUnique({ where: { email }, select: { id: true } });
          if (u) actualUserId = u.id;
        }

        if (actualUserId) {
          await prisma.rideSearch.deleteMany({
            where: { userId: actualUserId }
          });
        }
      } catch (err) {
        console.warn('[RideService] Database error clearing searches:', err);
      }
    }
  }
}

export const rideService = new RideService();
