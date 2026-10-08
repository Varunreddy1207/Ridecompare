import { randomUUID } from 'crypto';
import { prisma, isDatabaseConnected } from '../config/database';
import { SavedLocationCreateInput } from '../schemas/location.schema';
import { NotFoundError } from '../utils/errors';

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface SavedLocationRecord extends LocationItem {
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Sample landmark locations for search autocomplete
const POPULAR_LOCATIONS: LocationItem[] = [
  {
    id: 'loc-1',
    name: 'Sanjay Ghodawat University',
    address: 'Kolhapur-Sangli Highway, Atigre, Kolhapur, Maharashtra 416118',
    latitude: 16.7450,
    longitude: 74.3720
  },
  {
    id: 'loc-2',
    name: 'Chhatrapati Shahu Maharaj Terminus (Kolhapur Railway Station)',
    address: 'Station Road, Shahupuri, Kolhapur, Maharashtra 416001',
    latitude: 16.7028,
    longitude: 74.2405
  },
  {
    id: 'loc-3',
    name: 'Shri Ambabai Mahalaxmi Temple',
    address: 'Bhavani Mandap Road, Kolhapur, Maharashtra 416012',
    latitude: 16.6946,
    longitude: 74.2238
  },
  {
    id: 'loc-4',
    name: 'Central Bus Stand (CBS)',
    address: 'Shahupuri, Kolhapur, Maharashtra 416001',
    latitude: 16.7052,
    longitude: 74.2435
  },
  {
    id: 'loc-5',
    name: 'Rankala Lake',
    address: 'Rankala Lake Promenade, Kolhapur, Maharashtra 416012',
    latitude: 16.6894,
    longitude: 74.2144
  },
  {
    id: 'loc-6',
    name: 'DY Patil College of Engineering',
    address: 'Kasaba Bawada, Kolhapur, Maharashtra 416006',
    latitude: 16.7212,
    longitude: 74.2541
  },
  {
    id: 'loc-7',
    name: 'Kolhapur Airport (Ujalaiwadi)',
    address: 'Ujalaiwadi, Kolhapur, Maharashtra 416004',
    latitude: 16.6644,
    longitude: 74.2811
  },
  {
    id: 'loc-8',
    name: 'Shivaji University Campus',
    address: 'Vidyanagar, Kolhapur, Maharashtra 416004',
    latitude: 16.6775,
    longitude: 74.2547
  },
  {
    id: 'loc-9',
    name: 'DYP City Mall',
    address: 'Sayaji Hotel Road, Kawala Naka, Kolhapur, Maharashtra 416003',
    latitude: 16.7088,
    longitude: 74.2512
  },
  {
    id: 'loc-10',
    name: 'New Palace Museum',
    address: 'Bhavani Mandap Road, Kolhapur, Maharashtra 416003',
    latitude: 16.7198,
    longitude: 74.2307
  }
];

export class LocationService {
  // In-memory store fallback for saved locations
  private memorySavedLocations: Map<string, SavedLocationRecord[]> = new Map();

  /**
   * Search / autocomplete location queries
   */
  public async searchLocations(query: string = ''): Promise<LocationItem[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return POPULAR_LOCATIONS.slice(0, 5);
    }

    const matches = POPULAR_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(trimmed) ||
        loc.address.toLowerCase().includes(trimmed)
    );

    if (matches.length > 0) {
      return matches;
    }

    // Dynamic fallback location for arbitrary search terms
    return [
      {
        id: `custom-${Date.now()}`,
        name: query.trim(),
        address: `${query.trim()}, Kolhapur, Maharashtra`,
        latitude: 16.7050 + (Math.sin(query.length) * 0.05),
        longitude: 74.2433 + (Math.cos(query.length) * 0.05)
      }
    ];
  }

  /**
   * Get all saved locations for a user
   */
  public async getSavedLocations(userId: string): Promise<SavedLocationRecord[]> {
    if (isDatabaseConnected) {
      try {
        const locations = await prisma.savedLocation.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });

        return locations.map((loc) => ({
          id: loc.id,
          userId: loc.userId,
          name: loc.name,
          address: loc.address,
          latitude: loc.latitude,
          longitude: loc.longitude,
          createdAt: loc.createdAt.toISOString(),
          updatedAt: loc.createdAt.toISOString()
        }));
      } catch (err) {
        // Fall back to memory
      }
    }

    return this.memorySavedLocations.get(userId) || [];
  }

  /**
   * Save a new location for a user
   */
  public async createSavedLocation(
    userId: string,
    data: SavedLocationCreateInput
  ): Promise<SavedLocationRecord> {
    const now = new Date().toISOString();

    if (isDatabaseConnected) {
      try {
        const created = await prisma.savedLocation.create({
          data: {
            userId,
            name: data.name,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude
          }
        });

        const record: SavedLocationRecord = {
          id: created.id,
          userId: created.userId,
          name: created.name,
          address: created.address,
          latitude: created.latitude,
          longitude: created.longitude,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.createdAt.toISOString()
        };

        const existing = this.memorySavedLocations.get(userId) || [];
        this.memorySavedLocations.set(userId, [record, ...existing]);
        return record;
      } catch (err) {
        // Fall back to memory
      }
    }

    const newRecord: SavedLocationRecord = {
      id: randomUUID(),
      userId,
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: now,
      updatedAt: now
    };

    const existing = this.memorySavedLocations.get(userId) || [];
    this.memorySavedLocations.set(userId, [newRecord, ...existing]);
    return newRecord;
  }

  /**
   * Delete a saved location
   */
  public async deleteSavedLocation(userId: string, locationId: string): Promise<boolean> {
    if (isDatabaseConnected) {
      try {
        const loc = await prisma.savedLocation.findFirst({
          where: { id: locationId, userId }
        });

        if (!loc) {
          throw new NotFoundError('Saved location not found');
        }

        await prisma.savedLocation.delete({
          where: { id: locationId }
        });

        const existing = this.memorySavedLocations.get(userId) || [];
        this.memorySavedLocations.set(
          userId,
          existing.filter((item) => item.id !== locationId)
        );
        return true;
      } catch (err) {
        if (err instanceof NotFoundError) throw err;
        // Fall through to memory
      }
    }

    const existing = this.memorySavedLocations.get(userId) || [];
    const index = existing.findIndex((item) => item.id === locationId);
    if (index === -1) {
      throw new NotFoundError('Saved location not found');
    }

    existing.splice(index, 1);
    this.memorySavedLocations.set(userId, existing);
    return true;
  }
}

export const locationService = new LocationService();
