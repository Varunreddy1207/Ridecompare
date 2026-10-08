import { Router } from 'express';
import { quoteController } from '../controllers/quote.controller';

const router = Router();

router.get(
  '/:quoteId',
  quoteController.getQuoteById.bind(quoteController)
);

export default router;
