import { NormalizedQuote } from '../types/provider.types';
import { RideRecommendation } from '../types/ride.types';

export class RecommendationService {
  /**
   * Evaluates normalized quotes, tags cheapest/fastest, and determines best-value recommendation.
   */
  public evaluateQuotes(quotes: NormalizedQuote[]): {
    evaluatedQuotes: NormalizedQuote[];
    recommendation: RideRecommendation;
  } {
    const availableQuotes = quotes.filter((q) => q.status === 'AVAILABLE' && q.price > 0);

    if (availableQuotes.length === 0) {
      return {
        evaluatedQuotes: quotes,
        recommendation: {}
      };
    }

    // 1. Identify Cheapest Quote
    let cheapestQuote = availableQuotes[0];
    for (const q of availableQuotes) {
      if (q.price < cheapestQuote.price) {
        cheapestQuote = q;
      }
    }

    // 2. Identify Fastest Quote (lowest ETA)
    let fastestQuote = availableQuotes[0];
    for (const q of availableQuotes) {
      if (q.etaMinutes < fastestQuote.etaMinutes) {
        fastestQuote = q;
      }
    }

    // 3. Calculate Best Value Quote (weighted score of Price 50%, ETA 35%, Rating 15%)
    let bestValueQuote = availableQuotes[0];
    let bestScore = -Infinity;

    const maxPrice = Math.max(...availableQuotes.map((q) => q.price));
    const minPrice = Math.min(...availableQuotes.map((q) => q.price));
    const maxEta = Math.max(...availableQuotes.map((q) => q.etaMinutes));
    const minEta = Math.min(...availableQuotes.map((q) => q.etaMinutes));

    for (const q of availableQuotes) {
      // Normalized price score (0 to 1, higher is cheaper)
      const priceScore = maxPrice === minPrice ? 1 : 1 - (q.price - minPrice) / (maxPrice - minPrice);
      // Normalized ETA score (0 to 1, higher is faster)
      const etaScore = maxEta === minEta ? 1 : 1 - (q.etaMinutes - minEta) / (maxEta - minEta);
      // Rating score (0 to 1)
      const ratingScore = q.rating / 5.0;

      const compositeScore = priceScore * 0.5 + etaScore * 0.35 + ratingScore * 0.15;

      if (compositeScore > bestScore) {
        bestScore = compositeScore;
        bestValueQuote = q;
      }
    }

    // Tag quotes
    const evaluatedQuotes = quotes.map((q) => {
      const isCheapest = q.quoteId === cheapestQuote.quoteId || (q.provider === cheapestQuote.provider && q.vehicleType === cheapestQuote.vehicleType);
      const isFastest = q.quoteId === fastestQuote.quoteId || (q.provider === fastestQuote.provider && q.vehicleType === fastestQuote.vehicleType);

      return {
        ...q,
        isCheapest,
        isFastest
      };
    });

    const recommendation: RideRecommendation = {
      cheapestQuoteId: cheapestQuote.quoteId,
      fastestQuoteId: fastestQuote.quoteId,
      bestValueQuoteId: bestValueQuote.quoteId,
      provider: bestValueQuote.provider,
      vehicleType: bestValueQuote.vehicleType,
      reason: 'Optimal balance of competitive pricing, quick arrival time, and driver rating.'
    };

    return {
      evaluatedQuotes,
      recommendation
    };
  }
}

export const recommendationService = new RecommendationService();
