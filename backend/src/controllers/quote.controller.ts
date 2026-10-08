import { Request, Response, NextFunction } from 'express';
import { comparisonService } from '../services/comparison.service';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';

export class QuoteController {
  public async getQuoteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quoteId } = req.params;
      const quote = await comparisonService.getQuoteById(quoteId);

      if (!quote) {
        throw new NotFoundError(`Quote with ID '${quoteId}' was not found`);
      }

      sendSuccess(res, quote, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const quoteController = new QuoteController();
