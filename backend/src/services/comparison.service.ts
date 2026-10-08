import { randomUUID } from 'crypto';
import { prisma, isDatabaseConnected } from '../config/database';
import { RideProvider } from '../providers/provider.interface';
import { RapidoMockProvider } from '../providers/rapido/rapido.mock';
import { OlaMockProvider } from '../providers/ola/ola.mock';
import { UberMockProvider } from '../providers/uber/uber.mock';
import { LocationCoordinates, NormalizedQuote, ProviderQuoteRequest } from '../types/provider.types';
import { RideCompareData } from '../types/ride.types';
import { calculateDistanceKm, estimateTravelMinutes } from '../utils/distance';
import { recommendationService } from './recommendation.service';

export class ComparisonService {
  private providers: RideProvider[];
  public rapidoProvider: RapidoMockProvider;
  public olaProvider: OlaMockProvider;
  public uberProvider: UberMockProvider;

  // In-memory fallback store when PostgreSQL is offline
  private memorySearches: Map<string, { search: any; quotes: NormalizedQuote[] }> = new Map();

  constructor() {
    this.rapidoProvider = new RapidoMockProvider();
    this.olaProvider = new OlaMockProvider();
    this.uberProvider = new UberMockProvider();

    this.providers = [
      this.rapidoProvider,
      this.olaProvider,
      this.uberProvider
    ];
  }

  /**
   * Main comparison workflow:
   * Calculates distance/time, queries providers independently, tags cheapest/fastest,
   * saves to database (or resilient store), and returns normalized response.
   */
  public async compareRides(
    pickup: LocationCoordinates,
    destination: LocationCoordinates,
    userId?: string
  ): Promise<RideCompareData> {
    // 1. Calculate approximate distance & time
    const distanceKm = calculateDistanceKm(
      pickup.latitude,
      pickup.longitude,
      destination.latitude,
      destination.longitude
    );
    const estimatedMinutes = estimateTravelMinutes(distanceKm);

    const quoteRequest: ProviderQuoteRequest = {
      pickup,
      destination,
      distanceKm,
      estimatedMinutes
    };

    // 2. Request quotes from all enabled providers independently (Promise.allSettled)
    const providerPromises = this.providers.map(async (provider) => {
      try {
        const quotes = await provider.getQuotes(quoteRequest);
        return {
          providerName: provider.getProviderName(),
          quotes,
          failed: false
        };
      } catch (err: any) {
        console.warn(`[ComparisonService] Provider ${provider.getProviderName()} failed: ${err.message}`);
        // Return unavailable quote for each supported vehicle type instead of failing request
        const fallbackQuotes: NormalizedQuote[] = provider.getSupportedVehicleTypes().map((vehicleType) => ({
          provider: provider.getProviderName(),
          vehicleType,
          price: 0,
          currency: 'INR',
          etaMinutes: 0,
          rating: 4.0,
          status: 'UNAVAILABLE'
        }));

        return {
          providerName: provider.getProviderName(),
          quotes: fallbackQuotes,
          failed: true
        };
      }
    });

    const results = await Promise.allSettled(providerPromises);

    // 3. Flatten and normalize quotes
    let allQuotes: NormalizedQuote[] = [];
    results.forEach((res) => {
      if (res.status === 'fulfilled') {
        allQuotes.push(...res.value.quotes);
      }
    });

    // 4. Assign unique IDs to quotes
    allQuotes = allQuotes.map((q) => ({
      ...q,
      quoteId: q.quoteId || randomUUID()
    }));

    // 5. Evaluate and tag cheapest / fastest / best-value
    const { evaluatedQuotes, recommendation } = recommendationService.evaluateQuotes(allQuotes);

    // 6. Sort quotes: Available first, then by price ascending
    evaluatedQuotes.sort((a, b) => {
      if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1;
      if (a.status !== 'AVAILABLE' && b.status === 'AVAILABLE') return 1;
      return a.price - b.price;
    });

    const searchId = randomUUID();

    // 7. Persist to Database if available
    await this.persistSearchAndQuotes(
      searchId,
      pickup,
      destination,
      distanceKm,
      estimatedMinutes,
      evaluatedQuotes,
      userId
    );

    return {
      searchId,
      route: {
        distanceKm,
        estimatedMinutes
      },
      rides: evaluatedQuotes,
      recommendation
    };
  }

  /**
   * Persists search and quotes to PostgreSQL via Prisma (with in-memory fallback)
   */
  private async persistSearchAndQuotes(
    searchId: string,
    pickup: LocationCoordinates,
    destination: LocationCoordinates,
    distanceKm: number,
    estimatedMinutes: number,
    quotes: NormalizedQuote[],
    userId?: string
  ): Promise<void> {
    const searchRecord = {
      id: searchId,
      userId: userId || null,
      pickup: pickup.address,
      destination: destination.address,
      distanceKm,
      createdAt: new Date()
    };

    // Store in memory cache
    this.memorySearches.set(searchId, {
      search: {
        ...searchRecord,
        pickupAddress: pickup.address,
        pickupLatitude: pickup.latitude,
        pickupLongitude: pickup.longitude,
        destinationAddress: destination.address,
        destinationLatitude: destination.latitude,
        destinationLongitude: destination.longitude,
        estimatedMinutes
      },
      quotes
    });

    if (isDatabaseConnected) {
      try {
        await prisma.rideSearch.create({
          data: {
            id: searchId,
            userId: userId || null,
            pickup: pickup.address,
            destination: destination.address,
            distanceKm,
            quotes: {
              create: quotes.map((q) => ({
                id: q.quoteId || randomUUID(),
                provider: q.provider,
                vehicleType: q.vehicleType,
                price: q.price,
                currency: q.currency,
                etaMinutes: q.etaMinutes,
                rating: q.rating,
                status: q.status
              }))
            }
          }
        });
      } catch (err: any) {
        console.warn(`[ComparisonService] Failed to save search to PostgreSQL: ${err.message}`);
      }
    }
  }

  /**
   * Retrieve quote by ID (used by Quote Details API)
   */
  public async getQuoteById(quoteId: string): Promise<any | null> {
    // 1. Try Prisma first if database is connected
    if (isDatabaseConnected) {
      try {
        const quote = await prisma.rideQuote.findUnique({
          where: { id: quoteId },
          include: { rideSearch: true }
        });

        if (quote && quote.rideSearch) {
          return {
            quoteId: quote.id,
            searchId: quote.searchId,
            provider: quote.provider,
            vehicleType: quote.vehicleType,
            price: quote.price,
            currency: quote.currency,
            etaMinutes: quote.etaMinutes,
            rating: quote.rating,
            status: quote.status,
            pickup: {
              address: quote.rideSearch.pickup,
              latitude: 0,
              longitude: 0
            },
            destination: {
              address: quote.rideSearch.destination,
              latitude: 0,
              longitude: 0
            },
            distanceKm: quote.rideSearch.distanceKm,
            estimatedMinutes: Math.round(quote.rideSearch.distanceKm * 2.5),
            isCheapest: false,
            isFastest: false,
            createdAt: quote.createdAt.toISOString()
          };
        }
      } catch (err) {
        // Fall back to memory
      }
    }

    // 2. Memory cache lookup
    for (const [searchId, data] of this.memorySearches.entries()) {
      const match = data.quotes.find((q) => q.quoteId === quoteId);
      if (match) {
        return {
          quoteId: match.quoteId,
          searchId,
          provider: match.provider,
          vehicleType: match.vehicleType,
          price: match.price,
          currency: match.currency,
          etaMinutes: match.etaMinutes,
          rating: match.rating,
          status: match.status,
          pickup: {
            address: data.search.pickupAddress,
            latitude: data.search.pickupLatitude,
            longitude: data.search.pickupLongitude
          },
          destination: {
            address: data.search.destinationAddress,
            latitude: data.search.destinationLatitude,
            longitude: data.search.destinationLongitude
          },
          distanceKm: data.search.distanceKm,
          estimatedMinutes: data.search.estimatedMinutes,
          isCheapest: !!match.isCheapest,
          isFastest: !!match.isFastest,
          createdAt: data.search.createdAt ? new Date(data.search.createdAt).toISOString() : new Date().toISOString()
        };
      }
    }

    return null;
  }
}

export const comparisonService = new ComparisonService();
